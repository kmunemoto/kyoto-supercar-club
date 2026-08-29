import { getSupabase } from "@/integrations/supabase/client";
import { STAFF_COLUMNS, type StaffRow } from "@/integrations/supabase/types";
import { isCloudConfigured } from "@/lib/site";

export type StaffSession = {
  userId: string;
  email: string;
  role: string;
};

export function cloudAuthReady(): boolean {
  return isCloudConfigured();
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: sessionData } = await sb.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return null;
  const { data } = await sb
    .from("staff")
    .select(STAFF_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();
  // The client is untyped, so name the shape here rather than indexing into it.
  const staff = data as Pick<StaffRow, "user_id" | "role" | "email" | "display_name"> | null;
  if (!staff) return null;
  return {
    userId: user.id,
    email: user.email ?? staff.email ?? "",
    role: staff.role || "admin",
  };
}

export async function getAccessToken(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function signInStaff(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getSupabase();
  if (!sb) {
    return {
      ok: false,
      error: "Lovable Cloud が未接続のためログインできません。接続後にもう一度お試しください。",
    };
  }
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) {
    return { ok: false, error: "メールアドレスまたはパスワードが正しくありません。" };
  }
  const { data: staff } = await sb
    .from("staff")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!staff) {
    await sb.auth.signOut();
    return { ok: false, error: "このアカウントは管理者として登録されていません。" };
  }
  return { ok: true };
}

/**
 * There was no way to recover an account: a forgotten password meant editing
 * the auth user by hand in the Supabase dashboard. The reply always reads the
 * same whether or not the address exists, so this cannot be used to find out
 * who has an account.
 */
export async function requestStaffPasswordReset(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Lovable Cloud が未接続のため利用できません。" };
  const options =
    typeof window === "undefined" ? {} : { redirectTo: `${window.location.origin}/login/reset` };
  const { error } = await sb.auth.resetPasswordForEmail(email.trim(), options);
  // A failure here usually means rate limiting rather than an unknown address,
  // and saying so would leak which addresses are registered.
  if (error) console.error("[staff] password reset request failed", error.message);
  return { ok: true };
}

/** Completes a reset. Only works while the recovery link's session is active. */
export async function setStaffPassword(
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Lovable Cloud が未接続のため利用できません。" };
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    return { ok: false, error: "リンクの有効期限が切れています。もう一度お試しください。" };
  }
  const { error } = await sb.auth.updateUser({ password });
  if (error) return { ok: false, error: "パスワードを変更できませんでした。" };
  return { ok: true };
}

export async function signOutStaff() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
}
