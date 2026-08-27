import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import { ACCIDENT_POLICY, DRIVER_BURDEN_ITEMS, OPERATOR_SIDE_RESPONSIBILITY } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  component: Page,
  head: () =>
    pageHead({
      title: "利用条件（準備中）｜KYOTO SUPERCAR CLUB",
      description: "会員規約とオーナー契約は弁護士確認後に公開します。",
      path: "/terms",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="TERMS"
        title="利用条件（準備中）"
        lead="会員規約、オーナー契約、保証金、禁止事項の本文は、弁護士確認後に公開します。現時点のページは準備段階の案内です。"
      />
      <Section className="max-w-3xl space-y-8 pt-0">
        <p className="text-ink-soft">
          {BRAND.name}
          は招待制スーパーカーシェアの検証中であり、車両の予約・貸出・課金は行っていません。フォーム送信は相談または事前登録の意思表示であり、契約の成立ではありません。
        </p>
        <ul className="space-y-3 text-ink-soft">
          <li>クラブへの参加と、スーパーカーの運転資格は別です。</li>
          <li>ドライビング会員の運転は登録ご本人のみ。又貸しを禁じる方針です。</li>
          <li>サーキット、ドリフト、危険運転を禁じる方針です。</li>
          <li>オーナーご自身の利用を優先する方針です。</li>
          <li>許認可・保険が整うまで、貸出は開始しません。</li>
        </ul>
        <article>
          <h2 className="font-serif text-2xl">事故と運転者負担</h2>
          <p className="mt-3 text-ink-soft">{ACCIDENT_POLICY}</p>
          <p className="mt-4 text-sm text-muted">
            以下は将来の貸渡約款で検討する項目です。法令上認められる範囲で、運転者の責めに帰すべき場合に限ります。
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {DRIVER_BURDEN_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">次の内容まで運転者負担と断定しません。</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {OPERATOR_SIDE_RESPONSIBILITY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <p className="text-sm text-muted">
          法令や許認可に関する断定はしません。確認が必要な項目は運営の「要確認」に記録しています。
        </p>
        <Link to="/contact" className="inline-flex text-oxblood">
          質問はお問い合わせへ
        </Link>
      </Section>
    </SiteShell>
  );
}
