import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BRAND, FOOTER_LINKS, NAV } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Wordmark({ invert = false }: { invert?: boolean }) {
  return (
    <Link to="/" className="group block leading-none">
      <span
        className={cn(
          "font-serif text-[1.05rem] tracking-[0.18em]",
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5">
        <Wordmark />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="主要">
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/apply/owner"
            className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            車両提供
          </Link>
          <Link
            to="/apply/member"
            className="inline-flex h-11 items-center rounded-md bg-oxblood px-4 text-sm font-medium text-cream hover:bg-oxblood-dark"
          >
            事前登録
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line lg:hidden"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line bg-paper px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="モバイル">
            {NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex min-h-12 items-center text-base"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/apply/owner"
              className="mt-3 flex min-h-12 items-center border-t border-line pt-3"
              onClick={() => setOpen(false)}
            >
              車両提供について相談する
            </Link>
            <Link
              to="/apply/member"
              className="flex min-h-12 items-center font-medium text-oxblood"
              onClick={() => setOpen(false)}
            >
              会員事前登録をする
            </Link>
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
          <p className="mt-4 text-sm text-cream/55">{BRAND.region}から準備中</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} to={l.href} className="text-cream/80 hover:text-cream">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-cream/10 px-5 py-5 text-center text-xs tracking-wide text-cream/45">
        © {new Date().getFullYear()} {BRAND.name}
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2"
      >
        本文へスキップ
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
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
  return <section className={cn("mx-auto max-w-6xl px-5 py-16 md:py-24", className)}>{children}</section>;
}

export function Photo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
    />
  );
}
