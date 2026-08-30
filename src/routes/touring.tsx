import { createFileRoute } from "@tanstack/react-router";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { WebPageJsonLd } from "@/components/site/json-ld";
import { PlanBanner } from "@/components/site/conditions";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { LEGAL_BANNER, MORNING_RUN, faqsById } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/touring")({
  component: Page,
  head: () =>
    pageHead({
      title: `${MORNING_RUN.title}｜KYOTO SUPERCAR CLUB`,
      description: MORNING_RUN.lead,
      path: "/touring",
    }),
});

function Ctas() {
  return (
    <InquiryCta
      topic="MORNING RUN（ツーリング）について"
      place="touring"
      className="inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream type-cta"
    >
      MORNING RUNのご相談をする
    </InquiryCta>
  );
}

function Page() {
  return (
    <SiteShell>
      <WebPageJsonLd name={MORNING_RUN.title} description={MORNING_RUN.lead} path="/touring" />
      <PageIntro kicker={MORNING_RUN.kicker} title={MORNING_RUN.title} lead={MORNING_RUN.lead} />
      <Section>
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <div className="mt-8">
          <Ctas />
        </div>

        <h2 className="mt-20 font-serif text-3xl">イベントの内容</h2>
        <div className="mt-10 space-y-10">
          {MORNING_RUN.summary.map((p) => (
            <article key={p.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{p.title}</h3>
              <p className="mt-3 max-w-3xl text-ink-soft">{p.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-20 font-serif text-3xl">参加費の目安</h2>
        <p className="mt-6 max-w-3xl text-ink-soft">{MORNING_RUN.pricingNote}</p>

        <h2 className="mt-20 font-serif text-3xl">よくある質問</h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {faqsById(["morning-run", "collection-vs-owner"]).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-xl bg-charcoal px-6 py-10 text-cream md:px-10">
          <h2 className="font-serif text-2xl">参加をご検討の方へ</h2>
          <p className="mt-3 max-w-2xl text-cream/75">まずはご相談から、無料で承ります。</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <InquiryCta
              topic="MORNING RUN（ツーリング）について"
              place="touring-footer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-cream px-6 text-ink type-cta"
            >
              MORNING RUNのご相談をする
            </InquiryCta>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
