import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequestIP } from "@tanstack/react-start/server";
import { getSupabaseAnonKey, getSupabaseUrl, isCloudConfigured } from "@/lib/site";
import { newId } from "@/lib/utils";
import type { ContactInput, MemberPreregInput, OwnerInquiryInput } from "@/lib/schemas";

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

export async function insertOwnerInquiry(data: OwnerInquiryInput): Promise<Result> {
  if (!cloudReady()) return { ok: false, error: UNCONFIGURED };
  if (rateLimited("owner"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const client = insertClient();
  if (!client) return { ok: false, error: UNCONFIGURED };
  const id = newId("own");
  const now = new Date().toISOString();
  const { error } = await client.from("owner_inquiries").insert({
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
    lendable_period: null,
    management_needs: data.interests,
    reward_preference: null,
    photo_notes: null,
    questions: data.concerns,
    privacy_agreed: true,
    status: "new",
    owns_vehicle: data.ownsVehicle,
    mileage_band: data.mileageBand || null,
    storage_type: data.storageType,
    interests: data.interests,
    concerns: data.concerns,
    preferred_contact: data.preferredContact,
    free_text: data.freeText || null,
    created_at: now,
    updated_at: now,
    ...attr(data),
  });
  if (error) return { ok: false, error: SAVE_FAILED };
  await notify(
    "【車両提供相談】新しい先行相談",
    `地域: ${data.region}\nメーカー: ${data.make}\n車種: ${data.model}\nID: ${id}`,
  );
  return { ok: true, id };
}

export async function insertMemberPrereg(data: MemberPreregInput): Promise<Result> {
  if (!cloudReady()) return { ok: false, error: UNCONFIGURED };
  if (rateLimited("member"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const client = insertClient();
  if (!client) return { ok: false, error: UNCONFIGURED };
  const id = newId("mem");
  const now = new Date().toISOString();
  const { error } = await client.from("member_preregistrations").insert({
    id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    age: data.age,
    region: data.region,
    license_years: data.licenseYears,
    use_frequency: data.useFrequency,
    interest_models: data.interestModels,
    budget_band: data.budgetBand,
    use_purpose: data.usePurpose,
    incident_history: data.incidentHistory,
    requests: data.requests || null,
    privacy_agreed: true,
    status: "new",
    created_at: now,
    updated_at: now,
    ...attr(data),
  });
  if (error) return { ok: false, error: SAVE_FAILED };
  await notify("【会員事前登録】新しい登録", `地域: ${data.region}\nID: ${id}`);
  return { ok: true, id };
}

export async function insertContact(data: ContactInput): Promise<Result> {
  if (!cloudReady()) return { ok: false, error: UNCONFIGURED };
  if (rateLimited("contact"))
    return { ok: false, error: "送信が集中しています。しばらくしてから再度お試しください。" };
  const client = insertClient();
  if (!client) return { ok: false, error: UNCONFIGURED };
  const id = newId("inq");
  const now = new Date().toISOString();
  const { error } = await client.from("contact_inquiries").insert({
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
  });
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
