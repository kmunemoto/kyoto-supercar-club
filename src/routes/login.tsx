import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import {
  cloudAuthReady,
  getStaffSession,
  requestStaffPasswordReset,
  signInStaff,
} from "@/lib/staff";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () =>
    pageHead({
      title: "運営ログイン",
      description: "運営向け管理画面",
      path: "/login",
      noindex: true,
    }),
});

function Login() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const configured = cloudAuthReady();

  useEffect(() => {
    void getStaffSession().then((session) => {
      if (session) setSignedIn(true);
      setReady(true);
    });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await signInStaff(email, password);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    void navigate({ to: "/admin" });
  }

  async function onReset() {
    setError(null);
    if (!email.trim()) {
      setError("メールアドレスを入力してから押してください。");
      return;
    }
    setPending(true);
    const res = await requestStaffPasswordReset(email);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    // Deliberately unconditional: confirming which addresses are registered
    // would tell an outsider who the staff are.
    setNotice("登録済みのアドレスであれば、再設定用のリンクを送りました。");
  }

  if (!ready) return <main className="min-h-dvh bg-charcoal" />;

  return (
    <main className="grid min-h-dvh place-items-center bg-charcoal px-6 text-cream">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.22em] text-copper">{BRAND.phaseLabel}</p>
        <h1 className="mt-3 font-serif text-3xl tracking-[0.12em]">{BRAND.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">
          運営向けの管理画面です。一般のお客様はログイン不要です。
        </p>
        {!configured ? (
          <p className="mt-10 rounded-md border border-cream/20 p-4 text-sm leading-relaxed text-cream/80">
            現在、受付設定を確認中です。接続後に、登録された運営担当者だけがログインできます。
          </p>
        ) : signedIn ? (
          <Link
            to="/admin"
            className="mt-10 flex h-12 items-center justify-center rounded-md bg-oxblood text-cream"
          >
            管理画面を開く
          </Link>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <label className="block text-sm">
              メールアドレス
              <input
                className="mt-2 h-12 w-full rounded-md border border-cream/20 bg-cream/5 px-4 text-base text-cream"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label className="block text-sm">
              パスワード
              <input
                className="mt-2 h-12 w-full rounded-md border border-cream/20 bg-cream/5 px-4 text-base text-cream"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="text-sm text-copper">{error}</p> : null}
            {notice ? <p className="text-sm text-cream/80">{notice}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="flex h-12 w-full items-center justify-center rounded-md bg-oxblood text-cream disabled:opacity-60"
            >
              {pending ? "確認中…" : "ログイン"}
            </button>
            <button
              type="button"
              className="w-full text-center text-sm text-cream/60 underline-offset-4 hover:text-cream hover:underline"
              onClick={onReset}
              disabled={pending}
            >
              パスワードを忘れた場合
            </button>
          </form>
        )}
        <p className="mt-10 text-center text-sm">
          <Link to="/" className="text-cream/60 hover:text-cream">
            公開サイトへ戻る
          </Link>
        </p>
      </div>
    </main>
  );
}
