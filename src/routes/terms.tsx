import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { BRAND, pageTitle } from "@/lib/brand";

export const Route = createFileRoute("/terms")({
  component: Page,
  head: () => ({
    meta: [{ title: pageTitle("利用条件（準備中）") }],
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
          {BRAND.name}は招待制スーパーカーシェアの検証中であり、車両の予約・貸出・課金は行っていません。フォーム送信は相談または事前登録の意思表示であり、契約の成立ではありません。
        </p>
        <ul className="space-y-3 text-ink-soft">
          <li>登録ご本人以外の運転、又貸しを禁じる方針です。</li>
          <li>サーキット、ドリフト、危険運転を禁じる方針です。</li>
          <li>オーナーご自身の利用を優先する方針です。</li>
          <li>許認可・保険が整うまで、サービスは開始しません。</li>
        </ul>
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
