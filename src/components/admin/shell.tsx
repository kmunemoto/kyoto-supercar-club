import { Link, Outlet } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";
import { signOutStaff } from "@/lib/staff";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "概況", exact: true },
  { href: "/admin/owners", label: "オーナー申込", exact: false },
  { href: "/admin/members", label: "会員事前登録", exact: false },
  { href: "/admin/inquiries", label: "お問い合わせ", exact: false },
] as const;

export function AdminShell({ pathname }: { pathname: string }) {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-line bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-copper">ADMIN</p>
            <Link to="/admin" className="font-serif text-lg tracking-[0.08em]">
              {BRAND.short} 運営
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted hover:text-ink">
              公開サイト
            </Link>
            <button
              type="button"
              className="text-sm text-muted hover:text-ink"
              onClick={() => {
                signOutStaff();
                window.location.assign("/");
              }}
            >
              ログアウト
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2" aria-label="管理">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                to={l.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-2 text-sm",
                  active ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </div>
    </div>
  );
}
