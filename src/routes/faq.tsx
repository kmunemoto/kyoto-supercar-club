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
      description:
        "京都のスーパーカー共同購入と、既存オーナー限定の相互利用。料金は計画値、保険と許認可は確認中です。先行登録・相談のみ。",
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
        lead="予約できる状態ではありません。掲載の料金は現在の計画です。保険、名義、税込表示は確定次第ご案内します。"
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
