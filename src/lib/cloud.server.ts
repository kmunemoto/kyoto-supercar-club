import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequestIP } from "@tanstack/react-start/server";
import { BRAND } from "@/lib/brand";
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

const MAIL_TIMEOUT_MS = 5000;

/**
 * `noreply@resend.dev` is Resend's sandbox sender: it only ever reaches the
 * account owner. Set NOTIFY_FROM to an address on a verified domain before
 * relying on any of this in production.
 */
function mailFrom(): string {
  return env("NOTIFY_FROM") ?? "KYOTO SUPERCAR CLUB <noreply@resend.dev>";
}

/**
 * A lead that reaches the database but never reaches a person is a lead lost,
 * so every delivery failure is recorded rather than swallowed. The log row is
 * itself best-effort; the console line is what a deploy log will show.
 */
async function recordNotification(
  channel: string,
  subjectType: string,
  subjectId: string,
  payload: Record<string, unknown>,
  sentAt: string | null,
) {
  if (!sentAt) console.error(`[notify] ${channel} failed`, { subjectType, subjectId, ...payload });
  if (!cloudReady()) return;
  try {
    const client = insertClient();
    if (!client) return;
    await client.from("notification_log").insert({
      id: newId("ntf"),
      channel,
      subject_type: subjectType,
      subject_id: subjectId,
      payload,
      sent_at: sentAt,
      created_at: new Date().toISOString(),
    });
  } catch {
    /* the console line above is the fallback */
  }
}

async function sendMail(to: string, subject: string, text: string): Promise<string | null> {
  const key = env("RESEND_API_KEY");
  if (!key) return null;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: mailFrom(), to: [to], subject, text }),
      // Resend being slow must not become the visitor's wait.
      signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[notify] resend responded ${res.status}`, await res.text().catch(() => ""));
      return null;
    }
    return new Date().toISOString();
  } catch (error) {
    console.error("[notify] resend request failed", error);
    return null;
  }
}

/** Operator-facing new-lead alert. Deliberately carries no contact details. */
async function notify(subject: string, text: string, subjectType = "unknown", subjectId = "") {
  const to = env("NOTIFY_EMAIL");
  if (!env("RESEND_API_KEY") || !to) {
    console.error("[notify] RESEND_API_KEY or NOTIFY_EMAIL is not set; no alert was sent", {
      subjectType,
      subjectId,
      subject,
    });
    await recordNotification("operator_email", subjectType, subjectId, { subject }, null);
    return;
  }
  const sentAt = await sendMail(to, subject, text);
  await recordNotification("operator_email", subjectType, subjectId, { subject }, sentAt);
}

/**
 * Receipt for the person who just registered. Without it they keep no record
 * at all once the success panel is closed. It repeats that nothing has been
 * agreed or charged, and deliberately does not echo back what they entered.
 */
async function acknowledge(input: {
  email: string;
  fullName: string;
  heading: string;
  lead: string;
  subjectType: string;
  subjectId: string;
}) {
  if (!env("RESEND_API_KEY")) return;
  const text = [
    `${input.fullName} 様`,
    "",
    input.lead,
    "",
    `受付番号: ${input.subjectId}`,
    "",
    "現時点で契約・決済・購入申込は一切発生していません。掲載中の料金・条件は予定であり、",
    "正式募集の開始時に、適用される税を含む総額と契約条件をあらためてご案内します。",
    "",
    "内容を確認のうえ、必要に応じて担当より個別にご連絡します。",
    "このメールに心当たりがない場合は、お手数ですが破棄してください。",
    "",
    BRAND.name,
  ].join("\n");
  const sentAt = await sendMail(input.email, input.heading, text);
  await recordNotification(
    "applicant_receipt",
    input.subjectType,
    input.subjectId,
    { heading: input.heading },
    sentAt,
  );
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

/**
 * Cloud not being configured in production means the row has nowhere to go.
 * Mail the lead out in full rather than lose it: this is the last line before
 * a submission disappears.
 */
async function rescueUnsavedLead(subjectType: string, id: string, row: Record<string, unknown>) {
  await notify(
    `【要対応】保存できなかった申込（${subjectType}）`,
    [
      "データベースに保存できませんでした。設定を確認してください。",
      "以下は受信した内容です。復旧後に手動で登録してください。",
      "",
      JSON.stringify(row, null, 2),
    ].join("\n"),
    subjectType,
    id,
  );
}

/**
 * Insert with the current column set, falling back to the older one when the
 * database has not caught up. The fallback is recorded: quietly dropping the
 * newer columns forever is indistinguishable from success at the call site.
 */
async function insertWithFallback(
  table: string,
  full: Record<string, unknown>,
  legacy: Record<string, unknown>,
  subjectId: string,
): Promise<boolean> {
  const client = insertClient();
  if (!client) return false;
  const first = await client.from(table).insert(full);
  if (!first.error) return true;
  console.error(`[insert] ${table} rejected the current columns`, first.error.message);
  const fallback = await client.from(table).insert(legacy);
  if (fallback.error) {
    console.error(`[insert] ${table} legacy insert also failed`, fallback.error.message);
    return false;
  }
  const dropped = Object.keys(full).filter((key) => !(key in legacy));
  console.error(
    `[insert] ${table} saved without ${dropped.join(", ")} — run the pending migrations`,
  );
  await recordNotification("schema_drift", table, subjectId, { table, dropped }, null);
  return true;
}

async function insertSimple(table: string, row: Record<string, unknown>): Promise<boolean> {
  const client = insertClient();
  if (!client) return false;
  const { error } = await client.from(table).insert(row);
  if (error) {
    console.error(`[insert] ${table} failed`, error.message);
    return false;
  }
  return true;
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
    lendable_period: data.priorityUsePeriod || null,
    management_needs: data.managementNeeds ?? [],
    reward_preference: null,
    photo_notes: null,
    questions: data.concerns || null,
    privacy_agreed: true,
    status: "new",
    owns_vehicle: data.ownsVehicle,
    mileage_band: data.mileageBand || null,
    storage_type: data.storageType,
    interests: data.managementNeeds ?? [],
    concerns: data.concerns || null,
    preferred_contact: data.preferLine ? "LINE希望" : null,
    free_text: extra,
    participation_purpose: data.participationPurpose,
    priority_use_period: data.priorityUsePeriod || null,
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

  const summary = `地域: ${data.region}\nメーカー: ${data.make}\n車種: ${data.model}\n目的: ${data.participationPurpose}\nID: ${id}`;

  if (!cloudReady()) {
    const local = localDevInsert("owners", withNewColumns);
    if (!local.ok) {
      await rescueUnsavedLead("owner_inquiries", id, withNewColumns);
      return local;
    }
    await notify("【OWNER NETWORK】新しい先行相談（ローカル）", summary, "owner_inquiries", id);
    await acknowledgeOwner(data, id);
    return local;
  }
  if (!(await insertWithFallback("owner_inquiries", withNewColumns, base, id))) {
    await rescueUnsavedLead("owner_inquiries", id, withNewColumns);
    return { ok: false, error: SAVE_FAILED };
  }
  await notify("【OWNER NETWORK】新しい先行相談", summary, "owner_inquiries", id);
  await acknowledgeOwner(data, id);
  return { ok: true, id };
}

function acknowledgeOwner(data: OwnerInquiryInput, id: string) {
  return acknowledge({
    email: data.email,
    fullName: data.fullName,
    heading: `【${BRAND.short}】先行相談を受け付けました`,
    lead: "オーナーネットワークの先行相談を受け付けました。",
    subjectType: "owner_inquiries",
    subjectId: id,
  });
}

export async function insertCollectionInquiry(data: CollectionInquiryInput): Promise<Result> {
  if (rateLimited("collection"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const id = newId("col");
  const now = new Date().toISOString();
  const extra = [
    `希望メーカー: ${data.desiredMake || "未定"}`,
    `希望車種: ${data.desiredModel || "未定"}`,
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
    desired_make: data.desiredMake || null,
    desired_model: data.desiredModel || null,
    vehicle_condition: data.vehicleCondition,
    want_value_check: data.wantValueCheck,
    resale_priorities: data.resalePriorities ?? [],
    prefer_line: Boolean(data.preferLine),
  };
  const summary = `地域: ${data.region}\n希望: ${desiredModels}\n新車／中古: ${data.vehicleCondition}\nID: ${id}`;

  if (!cloudReady()) {
    const local = localDevInsert("collections", withNewColumns);
    if (!local.ok) {
      await rescueUnsavedLead("collection_inquiries", id, withNewColumns);
      return local;
    }
    await notify(
      "【COLLECTION】新しい共同オーナー候補（ローカル）",
      summary,
      "collection_inquiries",
      id,
    );
    await acknowledgeCollection(data, id);
    return local;
  }
  if (!(await insertWithFallback("collection_inquiries", withNewColumns, base, id))) {
    await rescueUnsavedLead("collection_inquiries", id, withNewColumns);
    return { ok: false, error: SAVE_FAILED };
  }
  await notify("【COLLECTION】新しい共同オーナー候補", summary, "collection_inquiries", id);
  await acknowledgeCollection(data, id);
  return { ok: true, id };
}

function acknowledgeCollection(data: CollectionInquiryInput, id: string) {
  return acknowledge({
    email: data.email,
    fullName: data.fullName,
    heading: `【${BRAND.short}】興味登録を受け付けました`,
    lead: "KSC COLLECTION（共同所有）の興味登録を受け付けました。",
    subjectType: "collection_inquiries",
    subjectId: id,
  });
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
  const summary = `地域: ${data.region}\n参加: ${data.participationInterests.join("、")}\nID: ${id}`;

  if (!cloudReady()) {
    const local = localDevInsert("members", row);
    if (!local.ok) {
      await rescueUnsavedLead("member_preregistrations", id, row);
      return local;
    }
    await notify("【会員事前登録】新しい登録（ローカル）", summary, "member_preregistrations", id);
    return local;
  }
  if (!(await insertSimple("member_preregistrations", row))) {
    await rescueUnsavedLead("member_preregistrations", id, row);
    return { ok: false, error: SAVE_FAILED };
  }
  await notify("【会員事前登録】新しい登録", summary, "member_preregistrations", id);
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
  const summary = `種別: ${data.topic}\nID: ${id}`;

  if (!cloudReady()) {
    const local = localDevInsert("contacts", row);
    if (!local.ok) {
      await rescueUnsavedLead("contact_inquiries", id, row);
      return local;
    }
    await notify("【お問い合わせ】新しいメッセージ（ローカル）", summary, "contact_inquiries", id);
    await acknowledgeContact(data, id);
    return local;
  }
  if (!(await insertSimple("contact_inquiries", row))) {
    await rescueUnsavedLead("contact_inquiries", id, row);
    return { ok: false, error: SAVE_FAILED };
  }
  await notify("【お問い合わせ】新しいメッセージ", summary, "contact_inquiries", id);
  await acknowledgeContact(data, id);
  return { ok: true, id };
}

function acknowledgeContact(data: ContactInput, id: string) {
  return acknowledge({
    email: data.email,
    fullName: data.fullName,
    heading: `【${BRAND.short}】お問い合わせを受け付けました`,
    lead: "お問い合わせを受け付けました。",
    subjectType: "contact_inquiries",
    subjectId: id,
  });
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
