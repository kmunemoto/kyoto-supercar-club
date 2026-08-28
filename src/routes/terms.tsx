import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import { LEGAL_BANNER } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  component: Page,
  head: () =>
    pageHead({
      title: "利用条件（準備中）｜KYOTO SUPERCAR CLUB",
      description: "共同所有契約とオーナー契約は、正式な提供開始前に公開します。",
      path: "/terms",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="TERMS"
        title="利用条件（準備中）"
        lead="本サービスの利用条件は現在整備中です。正式な提供開始前に、適用される法令・許認可・保険条件を確認し、確定した利用条件を公開します。"
      />
      <Section className="max-w-3xl space-y-8 pt-0">
        <p className="text-ink-soft">{LEGAL_BANNER}</p>
        <p className="text-ink-soft">
          {BRAND.name}
          のフォーム送信は、相談または興味登録の意思表示であり、契約の成立ではありません。
        </p>
        <ul className="space-y-3 text-ink-soft">
          <li>COLLECTIONは、参加者6人が購入資金を出し、共有持分を持つ共同所有です。</li>
          <li>OWNER NETWORKは、所有権と保管を元のオーナーに残した登録制の相互利用です。</li>
          <li>運転は登録ご本人のみ。又貸し、サーキット、ドリフト、危険運転を禁じる方針です。</li>
        </ul>
        <p className="text-sm text-muted">
          事故や損傷が発生した場合の負担、禁止事項、保証金の取り扱いは、正式募集時の契約条件で明示します。概要は安全・保険のページをご覧ください。
        </p>
        <p className="text-sm">
          <Link to="/safety" className="inline-flex text-oxblood">
            安全・保険について
          </Link>
          <span className="mx-3 text-muted">/</span>
          <Link to="/contact" className="inline-flex text-oxblood">
            お問い合わせ
          </Link>
        </p>
      </Section>
    </SiteShell>
  );
}
