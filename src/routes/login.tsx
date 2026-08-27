import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { BRAND, pageTitle } from "@/lib/brand";
import { getStaffSession, signInStaff } from "@/lib/staff";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: pageTitle("運営ログイン") },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function Login() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getStaffSession();
    if (session) {
      setSignedIn(true);
      setEmail(session.email);
    }
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = signInStaff(email, code);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    void navigate({ to: "/admin" });
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-charcoal px-6 text-cream">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.22em] text-copper">{BRAND.phaseLabel}</p>
        <h1 className="mt-3 font-serif text-3xl tracking-[0.12em]">{BRAND.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">
          運営向けの管理画面です。一般のお客様はログイン不要です。
        </p>
        {signedIn ? (
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
                className="mt-2 h-12 w-full rounded-md border border-cream/20 bg-cream/5 px-4 text-cream"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="block text-sm">
              運営コード
              <input
                className="mt-2 h-12 w-full rounded-md border border-cream/20 bg-cream/5 px-4 text-cream"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm text-copper">{error}</p> : null}
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-md bg-oxblood text-cream"
            >
              ログイン
            </button>
            <p className="text-xs leading-relaxed text-cream/50">
              初期の運営コードは README を参照してください。Lovable で Supabase
              を接続したあとは、認証を差し替えできます。
            </p>
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
