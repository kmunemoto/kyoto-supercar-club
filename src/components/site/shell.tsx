import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { BRAND, FOOTER_LINKS, MOBILE_AUX_NAV, MOBILE_SERVICE_CARDS, NAV } from "@/lib/brand";
import { PHOTO_NOTE } from "@/lib/content";
import { track } from "@/lib/analytics";
import { getLineUrl, lineCtaLabel } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Wordmark({ invert = false }: { invert?: boolean }) {
  return (
    <Link to="/" className="group min-w-0 block leading-none">
      <span
        className={cn(
          "block truncate font-serif text-[0.95rem] tracking-[0.14em] sm:text-[1.05rem] sm:tracking-[0.18em]",
          invert ? "text-cream" : "text-ink",
        )}
      >
        {BRAND.name}
      </span>
    </Link>
  );
}

export function PhaseChip({ invert = false }: { invert?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 text-[11px] font-medium tracking-[0.16em]",
        invert ? "border-cream/35 text-cream/90" : "border-oxblood/30 text-oxblood",
      )}
    >
      {BRAND.phaseLabel}
    </span>
  );
}

export function SiteHeader({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-5">
        <Wordmark />
        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="主要">
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "whitespace-nowrap text-sm text-ink-soft transition-colors hover:text-ink",
                "type-cta",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/apply/collection"
            onClick={() => track("collection_cta_click", { place: "header" })}
            className={cn(
              "inline-flex h-11 min-h-11 items-center rounded-md bg-oxblood px-4 text-sm text-cream hover:bg-oxblood-dark",
              "type-cta",
            )}
          >
            共同購入の興味登録
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-md border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood lg:hidden"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => onOpenChange(!open)}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {open ? (
        <div
          id={menuId}
          className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-line bg-paper px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <nav aria-label="スマートフォンメニュー">
            <p className="text-[11px] font-medium tracking-[0.18em] text-copper">はじめての方</p>
            <ul className="mt-3 flex flex-col gap-3">
              {MOBILE_SERVICE_CARDS.map((card) => (
                <li key={card.href}>
                  <Link
                    to={card.href}
                    className="block rounded-xl border border-line bg-cream px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
                    onClick={() => onOpenChange(false)}
                  >
                    <p className="text-[11px] font-medium tracking-[0.16em] text-copper">
                      {card.kicker}
                    </p>
                    <p className="mt-2 font-serif text-lg leading-snug text-ink type-cta">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{card.body}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[11px] font-medium tracking-[0.18em] text-copper">案内</p>
            <ul className="mt-2 flex flex-col">
              {MOBILE_AUX_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex min-h-12 items-center text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood",
                      "type-cta",
                    )}
                    onClick={() => onOpenChange(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-charcoal text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-xl tracking-[0.16em]">{BRAND.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">{BRAND.phaseNote}</p>
          <p className="mt-4 text-sm text-cream/55">{BRAND.region}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={cn("text-cream/80 hover:text-cream", "type-cta")}
            >
              {l.label}
            </Link>
          ))}
          <a href="/privacy#cookie" className={cn("text-cream/80 hover:text-cream", "type-cta")}>
            Cookie設定
          </a>
        </div>
      </div>
      <div className="border-t border-cream/10 px-5 py-5 text-center text-xs leading-relaxed tracking-wide text-cream/45">
        <p>{PHOTO_NOTE}</p>
        <p className="mt-2">
          © {new Date().getFullYear()} {BRAND.name}
        </p>
      </div>
    </footer>
  );
}

function stickyKind(pathname: string): "none" | "collection" | "owner" | "line" {
  if (
    pathname === "/" ||
    pathname.startsWith("/apply/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login")
  ) {
    return "none";
  }
  if (pathname.startsWith("/collection")) return "collection";
  if (pathname.startsWith("/owners")) return "owner";
  return "line";
}

function MobileStickyCta({ hidden }: { hidden: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const kind = stickyKind(pathname);
  const line = getLineUrl();
  if (hidden || kind === "none") return null;

  const className = cn(
    "pointer-events-auto flex min-h-12 items-center justify-center rounded-md bg-oxblood px-4 text-sm text-cream shadow-lg",
    "type-cta",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream",
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      {kind === "collection" ? (
        <Link
          to="/apply/collection"
          onClick={() => track("collection_cta_click", { place: "sticky" })}
          className={className}
        >
          共同購入の興味登録
        </Link>
      ) : null}
      {kind === "owner" ? (
        <Link
          to="/apply/owner"
          onClick={() => track("owner_cta_click", { place: "sticky" })}
          className={className}
        >
          愛車の登録を相談する
        </Link>
      ) : null}
      {kind === "line" ? (
        <a
          href={line || "/contact"}
          target={line ? "_blank" : undefined}
          rel={line ? "noopener noreferrer" : undefined}
          onClick={() => track(line ? "line_cta_click" : "contact_form_start", { place: "sticky" })}
          className={className}
        >
          {lineCtaLabel()}
        </a>
      ) : null}
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const showSticky = stickyKind(pathname) !== "none";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2"
      >
        本文へスキップ
      </a>
      <SiteHeader open={menuOpen} onOpenChange={setMenuOpen} />
      <main
        id="main"
        className={cn(
          "flex-1",
          showSticky && "pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0",
        )}
      >
        {children}
      </main>
      <SiteFooter />
      <MobileStickyCta hidden={menuOpen} />
    </div>
  );
}

export function PageIntro({
  kicker,
  title,
  lead,
}: {
  kicker?: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="mx-auto max-w-3xl px-5 pb-12 pt-14 md:pt-20">
      {kicker ? (
        <p className="mb-4 text-xs font-medium tracking-[0.22em] text-copper">{kicker}</p>
      ) : null}
      <h1 className="font-serif text-[2rem] leading-tight text-ink md:text-5xl">{title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">{lead}</p>
    </header>
  );
}

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-5 py-16 md:py-24", className)}>{children}</section>
  );
}

export function Photo({
  src,
  alt,
  className,
  priority = false,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("h-full w-full object-cover", className)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      decoding={priority ? "sync" : "async"}
    />
  );
}
