const KEY = "ksc.staff";

export type StaffSession = {
  email: string;
  role: "admin";
};

function readEnvCode(): string {
  const fromEnv = import.meta.env["VITE_STAFF_CODE"] as string | undefined;
  return (fromEnv && fromEnv.trim()) || "kyoto-staff";
}

export function getStaffSession(): StaffSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StaffSession;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function signInStaff(email: string, code: string): { ok: true } | { ok: false; error: string } {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes("@")) {
    return { ok: false, error: "メールアドレスを入力してください。" };
  }
  if (code.trim() !== readEnvCode()) {
    return { ok: false, error: "運営コードが違います。" };
  }
  const session: StaffSession = { email: trimmed, role: "admin" };
  sessionStorage.setItem(KEY, JSON.stringify(session));
  return { ok: true };
}

export function signOutStaff() {
  sessionStorage.removeItem(KEY);
}

export function requireStaffSession(): StaffSession {
  const s = getStaffSession();
  if (!s) {
    const err = new Error("Unauthorized");
    throw err;
  }
  return s;
}
