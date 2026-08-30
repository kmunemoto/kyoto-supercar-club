import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { FaqJsonLd } from "@/components/site/json-ld";
import { pageHead } from "@/lib/seo";
import { PlanBanner } from "@/components/site/conditions";
import { FAQS, LEGAL_BANNER } from "@/lib/content";

export const Route = createFileRoute("/faq")({
  component: Page,
  head: () =>
    pageHead({
      title: "よくある質問｜KYOTO SUPERCAR CLUB",
      description:
        "京都のスーパーカー共同購入と、既存オーナー向けの無料登録・売却相談・MORNING RUN・愛車撮影。料金は目安です。いまは興味登録と先行相談を受け付けています。",
      path: "/faq",
    }),
});

function Page() {
  return (
    <SiteShell>
      <FaqJsonLd />
      <PageIntro
        kicker="FAQ"
        title="よくある質問"
        lead="共同購入と、既存オーナー向けサービスについて、よくいただくご質問です。"
      />
      <Section className="pt-0">
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <dl className="mt-12 divide-y divide-line border-y border-line">
          {FAQS.map((f) => (
            <div key={f.q} className="grid gap-3 py-7 md:grid-cols-[0.9fr_1.4fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </SiteShell>
  );
}
