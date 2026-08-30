import { createFileRoute, Link } from "@tanstack/react-router";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { WebPageJsonLd } from "@/components/site/json-ld";
import { BulletList } from "@/components/site/conditions";
import { PageIntro, Photo, PhotoNote, Section, SiteShell } from "@/components/site/shell";
import {
  MORNING_RUN,
  PORTRAIT,
  REGISTRY_ELIGIBILITY,
  REGISTRY_POINTS,
  REGISTRY_SUMMARY,
  REGISTRY_VALUE_PROP,
  SALE_AGENT,
  faqsById,
} from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/owners")({
  component: Page,
  head: () =>
    pageHead({
      title: "KSC REGISTRY｜愛車の無料登録｜KYOTO SUPERCAR CLUB",
      description: REGISTRY_VALUE_PROP,
      path: "/owners",
    }),
});

function Ctas() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        to="/apply/owner"
        className="inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream type-cta"
      >
        愛車を無料で登録する
      </Link>
      <InquiryCta
        topic="REGISTRY（愛車の無料登録）について"
        className="inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-line px-6 type-cta"
      >
        {lineCtaLabel()}
      </InquiryCta>
    </div>
  );
}

const OWNER_SERVICES = [
  {
    kicker: SALE_AGENT.kicker,
    title: SALE_AGENT.title,
    lead: SALE_AGENT.lead,
    to: "/sell" as const,
    cta: "売却のご相談を見る",
  },
  {
    kicker: MORNING_RUN.kicker,
    title: MORNING_RUN.title,
    lead: MORNING_RUN.lead,
    to: "/touring" as const,
    cta: "MORNING RUNを見る",
  },
  {
    kicker: PORTRAIT.kicker,
    title: PORTRAIT.title,
    lead: PORTRAIT.lead,
    to: "/photography" as const,
    cta: "愛車ポートレートを見る",
  },
] as const;

function Page() {
  return (
    <SiteShell>
      <WebPageJsonLd
        name="KSC REGISTRY｜愛車の無料登録"
        description={REGISTRY_VALUE_PROP}
        path="/owners"
      />
      <PageIntro
        kicker="KSC REGISTRY｜既存スーパーカーオーナー限定・無料"
        title="愛車を無料で登録する。"
        lead={REGISTRY_SUMMARY}
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/keys-ferrari.jpg"
            alt="トレイに置いたフェラーリのスマートキー（イメージ写真）"
            className="aspect-[16/8]"
          />
        </div>
        <PhotoNote />
      </div>
      <Section>
        <div className="mt-8">
          <Ctas />
        </div>

        <h2 className="mt-20 font-serif text-3xl">REGISTRYとは</h2>
        <div className="mt-10 space-y-10">
          {REGISTRY_POINTS.map((p) => (
            <article key={p.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{p.title}</h3>
              <p className="mt-3 max-w-3xl text-ink-soft">{p.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-20 font-serif text-3xl">登録できる人</h2>
        <BulletList items={REGISTRY_ELIGIBILITY} />

        <h2 className="mt-20 font-serif text-3xl">登録から先にご案内できること</h2>
        <p className="mt-6 max-w-3xl text-lg text-ink-soft">
          REGISTRYへの登録は無料です。登録された方には、次のオーナー向けサービスについてご案内することがあります。いずれも現在は先行相談・興味登録の段階です。
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {OWNER_SERVICES.map((s) => (
            <article key={s.title} className="border-t border-line pt-6">
              <p className="text-xs tracking-[0.22em] text-copper">{s.kicker}</p>
              <h3 className="mt-3 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{s.lead}</p>
              <Link
                to={s.to}
                className="mt-6 inline-flex text-sm text-oxblood underline underline-offset-4"
              >
                {s.cta}
              </Link>
            </article>
          ))}
        </div>

        <h2 className="mt-20 font-serif text-3xl">よくある質問</h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {faqsById([
            "collection-vs-owner",
            "registry-fees",
            "owner-storage",
            "sale-agent",
            "morning-run",
            "photography",
            "screening",
          ]).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-xl bg-charcoal px-6 py-10 text-cream md:px-10">
          <h2 className="font-serif text-2xl">既存スーパーカーオーナーの方へ</h2>
          <p className="mt-3 max-w-2xl text-cream/75">
            愛車の登録は無料です。まずはREGISTRYへの登録から承っています。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/apply/owner"
              className="inline-flex h-12 items-center justify-center rounded-md bg-cream px-6 text-ink type-cta"
            >
              愛車を無料で登録する
            </Link>
            <InquiryCta
              topic="REGISTRY（愛車の無料登録）について"
              className="inline-flex h-12 items-center justify-center rounded-md border border-cream/40 px-6 text-cream type-cta"
            >
              {lineCtaLabel()}
            </InquiryCta>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
