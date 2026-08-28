import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequestIP } from "@tanstack/react-start/server";
import { getSupabaseAnonKey, getSupabaseUrl, isCloudConfigured } from "@/lib/site";
import { newId } from "@/lib/utils";
import type {
  CollectionInquiryInput,
  ContactInput,
  MemberPreregInput,
  OwnerInquiryInput,
} from "@/lib/schemas";

const UNCONFIGURED = "現在受付設定を確認中です。時間をおいて再度お試しください。";
const SAVE_FAILED = "送信に失敗しました。時間をおいて再度お試しください。";

type Result =
  { ok: true; id: string } | { ok: false; error: string; fields?: Record<string, string> };

const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(bucket: string): boolean {
  const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 8;
  const current = hits.get(key);
  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > max;
}

function env(name: string): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env[name] : undefined;
  if (fromProcess && fromProcess.trim()) return fromProcess.trim();
  return undefined;
}

function publicClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function serviceClient(): SupabaseClient | null {
  const url = getSupabaseUrl() ?? env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") ?? env("SUPABASE_SERVICE_ROLE");
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function insertClient(): SupabaseClient | null {
  return serviceClient() ?? publicClient();
}

export function cloudReady(): boolean {
  return isCloudConfigured();
}

function attr(input: {
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  landingPath?: string | undefined;
  referrer?: string | undefined;
}) {
  return {
    utm_source: input.utmSource || null,
    utm_medium: input.utmMedium || null,
    utm_campaign: input.utmCampaign || null,
    utm_content: input.utmContent || null,
    utm_term: input.utmTerm || null,
    landing_path: input.landingPath || null,
    referrer: input.referrer || null,
  };
}

async function notify(subject: string, text: string) {
  const key = env("RESEND_API_KEY");
  const to = env("NOTIFY_EMAIL");
  const from = env("NOTIFY_FROM") ?? "KYOTO SUPERCAR CLUB <noreply@resend.dev>";
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
  } catch {
    /* notification is best-effort */
  }
}

function ownerExtraSummary(data: OwnerInquiryInput): string {
  return [
    `他の登録車両を利用したいか: ${data.wantToUseOthers}`,
    `愛車を登録したいか: ${data.wantToRegisterCar}`,
    `1日200km基準の希望: ${data.dailyKmPreference}`,
    `運転者最低年齢: ${data.minDriverAge}`,
    `免許歴希望: ${data.requiredLicenseYears}`,
    `雨天利用: ${data.rainUse}`,
    `降雪時利用: ${data.snowUse}`,
    `走行地域の制限: ${data.regionLimit || "未記入"}`,
    `屋外夜間保管: ${data.outdoorNightParking}`,
    `受け渡し時の保管場所アクセス: ${data.handoverAccessOk}`,
    `LINEでの連絡希望: ${data.preferLine ? "はい" : "いいえ"}`,
    data.otherDriverConditions ? `その他の運転者条件: ${data.otherDriverConditions}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

const localDevStore: {
  owners: unknown[];
  collections: unknown[];
  members: unknown[];
  contacts: unknown[];
} = {
  owners: [],
  collections: [],
  members: [],
  contacts: [],
};

function localDevInsert(kind: keyof typeof localDevStore, row: unknown): Result {
  if (!import.meta.env.DEV) return { ok: false, error: UNCONFIGURED };
  const id = (row as { id?: string }).id ?? newId("loc");
  localDevStore[kind].unshift(row);
  return { ok: true, id };
}

export async function insertOwnerInquiry(data: OwnerInquiryInput): Promise<Result> {
  if (rateLimited("owner"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const id = newId("own");
  const now = new Date().toISOString();
  const extra = ownerExtraSummary(data);
  const base = {
    id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone || null,
    region: data.region,
    make: data.make,
    model: data.model,
    year: data.year ?? null,
    mileage_km: null,
    storage_location: null,
    annual_use_count: data.annualUseCount,
    lendable_period: data.priorityUsePeriod,
    management_needs: data.managementNeeds ?? [],
    reward_preference: null,
    photo_notes: null,
    questions: data.concerns,
    privacy_agreed: true,
    status: "new",
    owns_vehicle: data.ownsVehicle,
    mileage_band: data.mileageBand || null,
    storage_type: data.storageType,
    interests: data.managementNeeds ?? [],
    concerns: data.concerns,
    preferred_contact: data.preferLine ? "LINE希望" : null,
    free_text: extra,
    participation_purpose: data.participationPurpose,
    priority_use_period: data.priorityUsePeriod,
    annual_km_cap: data.dailyKmPreference,
    other_driver_conditions: extra,
    created_at: now,
    updated_at: now,
    ...attr(data),
  };
  const withNewColumns = {
    ...base,
    want_to_use_others: data.wantToUseOthers,
    want_to_register_car: data.wantToRegisterCar,
    daily_km_preference: data.dailyKmPreference,
    min_driver_age: data.minDriverAge,
    license_years_pref: data.requiredLicenseYears,
    rain_use: data.rainUse,
    snow_use: data.snowUse,
    region_limit: data.regionLimit || null,
    outdoor_night_parking: data.outdoorNightParking,
    handover_access_ok: data.handoverAccessOk,
    prefer_line: Boolean(data.preferLine),
  };

  if (!cloudReady()) {
    const local = localDevInsert("owners", withNewColumns);
    if (local.ok) {
      await notify(
        "【OWNER NETWORK】新しい先行相談（ローカル）",
        `地域: ${data.region}\nメーカー: ${data.make}\n車種: ${data.model}\n目的: ${data.participationPurpose}\nID: ${id}`,
      );
    }
    return local;
  }
  const client = insertClient();
  if (!client) return { ok: false, error: UNCONFIGURED };
  const first = await client.from("owner_inquiries").insert(withNewColumns);
  if (first.error) {
    const fallback = await client.from("owner_inquiries").insert(base);
    if (fallback.error) return { ok: false, error: SAVE_FAILED };
  }
  await notify(
    "【OWNER NETWORK】新しい先行相談",
    `地域: ${data.region}\nメーカー: ${data.make}\n車種: ${data.model}\n目的: ${data.participationPurpose}\nID: ${id}`,
  );
  return { ok: true, id };
}

export async function insertCollectionInquiry(data: CollectionInquiryInput): Promise<Result> {
  if (rateLimited("collection"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const id = newId("col");
  const now = new Date().toISOString();
  const extra = [
    `希望メーカー: ${data.desiredMake}`,
    `希望車種: ${data.desiredModel}`,
    `新車／中古: ${data.vehicleCondition}`,
    `VALUE CHECK希望: ${data.wantValueCheck}`,
    `再販・保有: ${(data.resalePriorities ?? []).join("、") || "未記入"}`,
    `LINEでの連絡希望: ${data.preferLine ? "はい" : "いいえ"}`,
  ].join("\n");
  const concerns = [data.concerns, extra].filter(Boolean).join("\n\n");
  const desiredModels =
    data.desiredModels ||
    [data.desiredMake, data.desiredModel].filter(Boolean).join(" ").trim() ||
    "未定";
  const base = {
    id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    applicant_type: data.applicantType,
    region: data.region,
    kyoto_connection: data.kyotoConnection,
    current_vehicle_status: data.currentVehicleStatus,
    desired_models: desiredModels,
    budget_band: data.budgetBand,
    desired_days_per_year: data.desiredDaysPerYear,
    desired_km_per_year: data.desiredKmPerYear,
    desired_start_timing: data.desiredStartTiming,
    license_years: data.licenseYears ?? null,
    incident_history: data.incidentHistory || "興味登録のため未申告",
    priorities: data.priorities,
    concerns,
    privacy_agreed: true,
    status: "new",
    created_at: now,
    updated_at: now,
    ...attr(data),
  };
  const withNewColumns = {
    ...base,
    desired_make: data.desiredMake,
    desired_model: data.desiredModel,
    vehicle_condition: data.vehicleCondition,
    want_value_check: data.wantValueCheck,
    resale_priorities: data.resalePriorities ?? [],
    prefer_line: Boolean(data.preferLine),
  };
  if (!cloudReady()) {
    const local = localDevInsert("collections", withNewColumns);
    if (local.ok) {
      await notify(
        "【COLLECTION】新しい共同オーナー候補（ローカル）",
        `地域: ${data.region}\n希望: ${desiredModels}\n新車／中古: ${data.vehicleCondition}\nID: ${id}`,
      );
    }
    return local;
  }
  const client = insertClient();
  if (!client) return { ok: false, error: UNCONFIGURED };
  const first = await client.from("collection_inquiries").insert(withNewColumns);
  if (first.error) {
    const fallback = await client.from("collection_inquiries").insert(base);
    if (fallback.error) return { ok: false, error: SAVE_FAILED };
  }
  await notify(
    "【COLLECTION】新しい共同オーナー候補",
    `地域: ${data.region}\n希望: ${desiredModels}\n新車／中古: ${data.vehicleCondition}\nID: ${id}`,
  );
  return { ok: true, id };
}

export async function insertMemberPrereg(data: MemberPreregInput): Promise<Result> {
  if (rateLimited("member"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const id = newId("mem");
  const now = new Date().toISOString();
  const row = {
    id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    age: data.age ?? null,
    region: data.region,
    license_years: data.licenseYears ?? null,
    use_frequency: data.useFrequency || null,
    interest_models: data.interestModels ?? [],
    participation_interests: data.participationInterests,
    budget_band: data.budgetBand || null,
    use_purpose: data.usePurpose || null,
    incident_history: data.incidentHistory || null,
    requests: data.requests || null,
    privacy_agreed: true,
    status: "new",
    created_at: now,
    updated_at: now,
    ...attr(data),
  };
  if (!cloudReady()) return localDevInsert("members", row);
  const client = insertClient();
  if (!client) return { ok: false, error: UNCONFIGURED };
  const { error } = await client.from("member_preregistrations").insert(row);
  if (error) return { ok: false, error: SAVE_FAILED };
  await notify(
    "【会員事前登録】新しい登録",
    `地域: ${data.region}\n参加: ${data.participationInterests.join("、")}\nID: ${id}`,
  );
  return { ok: true, id };
}

export async function insertContact(data: ContactInput): Promise<Result> {
  if (rateLimited("contact"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const id = newId("inq");
  const now = new Date().toISOString();
  const row = {
    id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone || null,
    topic: data.topic,
    message: data.message,
    privacy_agreed: true,
    status: "new",
    created_at: now,
    updated_at: now,
    ...attr(data),
  };
  if (!cloudReady()) return localDevInsert("contacts", row);
  const client = insertClient();
  if (!client) return { ok: false, error: UNCONFIGURED };
  const { error } = await client.from("contact_inquiries").insert(row);
  if (error) return { ok: false, error: SAVE_FAILED };
  await notify("【お問い合わせ】新しいメッセージ", `種別: ${data.topic}\nID: ${id}`);
  return { ok: true, id };
}

export async function staffDb(
  accessToken: string,
): Promise<
  { ok: true; userId: string; email: string; db: SupabaseClient } | { ok: false; error: string }
> {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  if (!url || !anon) return { ok: false, error: UNCONFIGURED };
  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await userClient.auth.getUser(accessToken);
  const user = data.user;
  if (error || !user) return { ok: false, error: "UNAUTHORIZED" };
  const db = serviceClient() ?? userClient;
  const { data: staff } = await db
    .from("staff")
    .select("user_id, role, email")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!staff) return { ok: false, error: "FORBIDDEN" };
  return { ok: true, userId: user.id, email: user.email ?? "", db };
}
