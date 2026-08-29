import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { cloudAuthReady, setStaffPassword } from "@/lib/staff";

// The trailing underscore on `login_` keeps this off /login's route tree.
// Without it TanStack nests this under login.tsx, which renders no <Outlet />,
// so the recovery link from the mail rendered the sign-in form instead.
export const Route = createFileRoute("/login_/reset")({
  component: Reset,
  head: () =>
    pageHead({
      title: "パスワードの再設定",
      description: "運営向け管理画面",
      path: "/login/reset",
      noindex: true,
    }),
});

const FIELD =
  "mt-2 h-12 w-full rounded-md border border-cream/20 bg-cream/5 px-4 text-base text-cream";

/**
 * Where the recovery mail lands. Supabase puts the recovery token in the URL
 * fragment and the client exchanges it for a session before this renders, so
 * there is nothing to read out of the URL here.
 */
function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const configured = cloudAuthReady();

  useEffect(() => {
    // The token arrives in the fragment; clear it once the client has consumed
    // it so it is not left sitting in the address bar or in history.
    if (typeof window !== "undefined" && window.location.hash) {
      const timer = setTimeout(() => {
        window.history.replaceState(null, "", window.location.pathname);
      }, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 12) {
      setError("12文字以上にしてください。");
      return;
    }
    if (password !== confirm) {
      setError("2つのパスワードが一致しません。");
      return;
    }
    setPending(true);
    const res = await setStaffPassword(password);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    setTimeout(() => void navigate({ to: "/admin" }), 1200);
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-charcoal px-6 text-cream">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.22em] text-copper">{BRAND.short} 運営</p>
        <h1 className="mt-3 font-serif text-2xl tracking-[0.08em]">パスワードの再設定</h1>
        {!configured ? (
          <p className="mt-8 rounded-md border border-cream/20 p-4 text-sm text-cream/80">
            現在、パスワードの再設定はご利用いただけません。
          </p>
        ) : done ? (
          <p className="mt-8 rounded-md border border-cream/20 p-4 text-sm text-cream/80">
            変更しました。管理画面へ移動します。
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block text-sm">
              新しいパスワード（12文字以上）
              <input
                className={FIELD}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
            <label className="block text-sm">
              確認のためもう一度
              <input
                className={FIELD}
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
            {error ? <p className="text-sm text-copper">{error}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="flex h-12 w-full items-center justify-center rounded-md bg-oxblood text-cream disabled:opacity-60"
            >
              {pending ? "変更中…" : "パスワードを変更"}
            </button>
          </form>
        )}
        <p className="mt-10 text-center text-sm">
          <Link to="/login" className="text-cream/60 hover:text-cream">
            ログイン画面へ戻る
          </Link>
        </p>
      </div>
    </main>
  );
}
