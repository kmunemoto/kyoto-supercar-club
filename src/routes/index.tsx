import { createFileRoute, Link } from "@tanstack/react-router";
import { Photo, Section, SiteShell } from "@/components/site/shell";
import { FaqJsonLd, SiteJsonLd } from "@/components/site/json-ld";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { BRAND } from "@/lib/brand";
import {
  BRAND_PURPOSE,
  BUSINESS_PATHS,
  FAQS,
  HERO_PILLARS,
  LEGAL_BANNER,
  MANAGEMENT_INTRO,
  MANAGEMENT_ITEMS,
} from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () =>
    pageHead({
      title: "京都のスーパーカー共同所有｜KYOTO SUPERCAR CLUB",
      description:
        "京都から、車に憧れる文化をもう一度。6人での共同購入と、既存オーナー限定の相互利用を準備しています。先行登録・相談のみ。",
      path: "/",
    }),
});

function Home() {
  return (
    <SiteShell>
      <SiteJsonLd />
      <FaqJsonLd />
      <section className="relative min-h-[62dvh] overflow-hidden bg-charcoal md:min-h-[88dvh]">
        <Photo
          src="/images/hero.jpg"
          alt="雨の京都の通りに停まる赤いスーパーカー"
          className="absolute inset-0 h-full w-full object-cover object-[46%_center] md:object-center"
          priority
          width={1500}
          height={844}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/20" />
        <div className="relative mx-auto flex min-h-[62dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 text-cream md:min-h-[88dvh] md:pb-24">
          <p className="text-xs font-medium tracking-[0.28em] text-cream/80">
            京都を拠点に｜{BRAND.phaseLabel}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.1rem] leading-[1.2] md:text-6xl">
            {BRAND.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            {BRAND_PURPOSE.paragraphs[0]}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/collection"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-cream px-5 py-3 text-center text-ink type-cta"
            >
              共同購入に興味がある方
            </Link>
            <Link
              to="/owners"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-cream/40 px-5 py-3 text-center text-cream type-cta"
            >
              愛車を登録したい方
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_PILLARS.map((item) => (
            <div key={item.title}>
              <h2 className="font-serif text-xl">{item.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-10">
          <p className="max-w-3xl border-l-2 border-copper pl-4 text-sm leading-relaxed text-ink-soft">
            {LEGAL_BANNER}
          </p>
        </div>
      </section>

      <Section>
        <p className="text-xs tracking-[0.22em] text-copper">PURPOSE</p>
        <h2 className="mt-4 max-w-3xl font-serif text-3xl md:text-4xl">{BRAND_PURPOSE.heading}</h2>
        <div className="mt-6 max-w-3xl space-y-4 text-ink-soft">
          {BRAND_PURPOSE.paragraphs.slice(1).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          {BUSINESS_PATHS.map((path) => (
            <article key={path.title} className="border-t border-cream/20 pt-8">
              <p className="text-xs tracking-[0.22em] text-copper">{path.kicker}</p>
              <h2 className="mt-4 font-serif text-3xl">{path.title}</h2>
              <p className="mt-4 text-cream/75">{path.body}</p>
              <Link
                to={path.to}
                className="mt-8 inline-flex text-sm text-cream underline underline-offset-4"
              >
                {path.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <Section>
        <p className="text-xs tracking-[0.22em] text-copper">CARE</p>
        <h2 className="mt-4 font-serif text-3xl">2つの仕組みに合わせた車両管理</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">{MANAGEMENT_INTRO}</p>
        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {MANAGEMENT_ITEMS.map((item) => (
            <li key={item.title} className="border-t border-line pt-5">
              <h3 className="font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-3xl">よくある質問</h2>
          <Link to="/faq" className="text-sm text-oxblood">
            すべて見る
          </Link>
        </div>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {FAQS.filter((f) =>
            [
              "今すぐ車を借りられますか？",
              "COLLECTIONとOWNER NETWORKの違いは何ですか？",
              "いま代金や申込金は必要ですか？",
              "京都在住でないと参加できませんか？",
            ].includes(f.q),
          ).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <section className="relative overflow-hidden bg-charcoal py-20 text-cream">
        <Photo
          src="/images/river.jpg"
          alt="夕方の川と山"
          className="absolute inset-0 opacity-40"
          width={1600}
          height={900}
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="text-xs tracking-[0.22em] text-cream/70">{BRAND.region}</p>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl">話を聞いてみたい方へ</h2>
          <p className="mt-4 text-sm text-cream/70">
            共同購入の興味登録と、愛車の先行相談を受け付けています。
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/apply/collection"
              className={`inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-cream px-6 text-ink type-cta`}
            >
              共同購入の興味登録をする
            </Link>
            <InquiryCta
              topic="共同所有について"
              className={`inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-cream/40 px-6 text-cream type-cta`}
            >
              {lineCtaLabel()}
            </InquiryCta>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
