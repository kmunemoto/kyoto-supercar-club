import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { FaqJsonLd } from "@/components/site/json-ld";
import { pageHead } from "@/lib/seo";
import { FAQS } from "@/lib/content";

export const Route = createFileRoute("/faq")({
  component: Page,
  head: () =>
    pageHead({
      title: "よくある質問｜KYOTO SUPERCAR CLUB",
      description: "京都府内限定の準備中サービスに関する質問。料金・車種・保険は未確定です。",
      path: "/faq",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="FAQ"
        title="よくある質問"
        lead="予約できる状態ではありません。料金、車種、保険は確定次第、改めてご案内します。"
      />
      <Section className="pt-0">
        <dl className="divide-y divide-line border-y border-line">
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
