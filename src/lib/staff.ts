import { getSupabase } from "@/integrations/supabase/client";
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
  const { data: staff } = await sb
    .from("staff")
    .select("user_id, role, email")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!staff) return null;
  const roleValue = staff["role"];
  return {
    userId: user.id,
    email: user.email ?? String(staff["email"] ?? ""),
    role: typeof roleValue === "string" ? roleValue : "admin",
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
      error: "現在、受付設定を確認中です。Lovable Cloud の接続後にログインできます。",
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

export async function signOutStaff() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
}
