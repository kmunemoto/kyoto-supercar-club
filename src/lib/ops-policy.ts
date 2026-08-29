/**
 * The decisions behind lead handling that are worth being sure about, kept free
 * of imports so they can be tested directly.
 *
 * These rules only ever matter when something else has gone wrong — a missing
 * environment variable, a lead nobody picked up — which is exactly why they
 * were the least exercised code in the project.
 */

/** Resend's sandbox sender. It only ever reaches the account owner. */
export const SANDBOX_SENDER = "noreply@resend.dev";

/** NOTIFY_EMAIL is a comma-separated list so a lead can reach more than one inbox. */
export function parseRecipients(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export function isSandboxSender(from: string | undefined): boolean {
  return !from || from.includes(SANDBOX_SENDER);
}

export type OpsEnv = {
  serviceRoleKey?: string | undefined;
  resendApiKey?: string | undefined;
  notifyFrom?: string | undefined;
  notifyEmail?: string | undefined;
};

/**
 * What is quietly not working. Every item here fails silently in production:
 * the notification log and the duplicate check are wrapped in catches, and a
 * sandbox sender returns success from Resend while delivering to nobody.
 */
export function opsWarnings(env: OpsEnv): string[] {
  const warnings: string[] = [];
  if (!env.serviceRoleKey) {
    warnings.push(
      "SUPABASE_SERVICE_ROLE_KEY が未設定です。通知の送達記録と重複送信の検知が無効になっています。",
    );
  }
  if (!env.resendApiKey) {
    warnings.push("RESEND_API_KEY が未設定です。受付控えと新着通知のメールは送信されません。");
  } else if (isSandboxSender(env.notifyFrom)) {
    warnings.push(
      "NOTIFY_FROM が未設定です。差出人が Resend のサンドボックスのままで、アカウント所有者以外には届きません。",
    );
  }
  const recipients = parseRecipients(env.notifyEmail);
  if (recipients.length === 0) {
    warnings.push("NOTIFY_EMAIL が未設定です。新着リードの通知先がありません。");
  } else if (recipients.length === 1) {
    warnings.push(
      "NOTIFY_EMAIL の宛先が1件です。カンマ区切りで2件以上にすると、片方が見落としても気づけます。",
    );
  }
  return warnings;
}

/** A lead still untouched after this many days needs chasing. */
export const STALE_NEW_DAYS = 3;

/**
 * Once a lead is being worked it stalls in the middle of the process, not at
 * the front of it. Those statuses get a longer rope than an untouched lead —
 * not none at all, which was the previous behaviour.
 */
export const STALE_OPEN_DAYS = 14;

export const OPEN_STATUSES = ["reviewing", "interview_scheduled", "terms_adjusting"] as const;

export type StaleRow = {
  status: string;
  created_at?: string | null | undefined;
  updated_at?: string | null | undefined;
};

function daysBetween(value: string | null | undefined, now: number): number | null {
  if (!value) return null;
  const at = Date.parse(value);
  if (Number.isNaN(at)) return null;
  return (now - at) / (24 * 60 * 60 * 1000);
}

export function isStale(row: StaleRow, now: number): boolean {
  if (row.status === "new") {
    const age = daysBetween(row.created_at, now);
    return age !== null && age > STALE_NEW_DAYS;
  }
  if (!(OPEN_STATUSES as readonly string[]).includes(row.status)) return false;
  // Fall back to created_at for rows written before updated_at was maintained.
  const idle = daysBetween(row.updated_at, now) ?? daysBetween(row.created_at, now);
  return idle !== null && idle > STALE_OPEN_DAYS;
}

export function countStale(rows: StaleRow[], now: number): number {
  return rows.filter((row) => isStale(row, now)).length;
}
