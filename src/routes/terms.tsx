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
      description: "共同所有契約とオーナー契約は弁護士確認後に公開します。",
      path: "/terms",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="TERMS"
        title="利用条件（準備中）"
        lead="共同所有契約、オーナー契約、禁止事項の本文は、弁護士確認後に公開します。現時点のページは準備段階の案内です。"
      />
      <Section className="max-w-3xl space-y-8 pt-0">
        <p className="text-ink-soft">
          {BRAND.name}
          はサービス準備・検証段階です。車両の予約・貸出・課金・購入申込は行っていません。フォーム送信は相談または事前登録の意思表示であり、契約の成立ではありません。現時点で車両代や申込金は受け取りません。
        </p>
        <ul className="space-y-3 text-ink-soft">
          <li>KSCが車を所有して利用権だけを販売する方式ではありません。</li>
          <li>
            共同所有は、参加者6人が購入資金を出し、共有持分を持つ構想です。法的構造は確認中です。
          </li>
          <li>車両価値、売却価格、利用可能日は保証しません。投資商品として扱いません。</li>
          <li>オーナーネットワークは共同所有ではなく、所有権と保管は元のオーナーに残します。保証金はありません。</li>
          <li>一般会員向けの貸し出しは現在行っていません。一般向けレンタカーではありませんが、貸渡該当性は確認中です。</li>
          <li>運転は登録ご本人のみ。又貸し、サーキット、ドリフト、危険運転を禁じる方針です。</li>
          <li>審査内容により、KSCから追加確認をお願いする場合があります。</li>
          <li>実際の相互利用は、許認可・保険・契約体制の確定後に開始します。</li>
        </ul>
        <article>
          <h2 className="font-serif text-2xl">事故と運転者負担</h2>
          <p className="mt-3 text-ink-soft">{ACCIDENT_POLICY}</p>
          <p className="mt-4 text-sm text-muted">
            以下は将来の契約で検討する項目です。法令上認められる範囲で、運転者の責めに帰すべき場合に限ります。
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
