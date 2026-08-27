import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { BRAND, pageTitle } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  component: Page,
  head: () => ({
    meta: [{ title: pageTitle("プライバシーポリシー") }],
  }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="PRIVACY"
        title="プライバシーポリシー"
        lead={`${BRAND.name}（以下「当サービス」）は、準備段階でお預かりする個人情報の取扱いを、次のとおり定めます。法令に基づき、専門家確認のうえ更新します。`}
      />
      <Section className="prose-like max-w-3xl space-y-10 pt-0">
        <article>
          <h2 className="font-serif text-2xl">1. 取得する情報</h2>
          <p className="mt-3 text-ink-soft">
            車両提供の相談、会員事前登録、お問い合わせにおいて、氏名、メールアドレス、電話番号、居住地域、年齢、免許取得年数、車両情報、自己申告の運転歴、自由記述を取得します。この段階では、免許証画像などの本人確認書類は取得しません。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">2. 利用目的</h2>
          <p className="mt-3 text-ink-soft">
            お申し込みへの返答、面談の調整、サービス設計のための集計、法令上必要な確認に限ります。販売目的の第三者提供は行いません。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">3. 保管と開示</h2>
          <p className="mt-3 text-ink-soft">
            申込内容は運営担当者のみが閲覧できる管理画面に保管します。一般のサイト訪問者からは閲覧できません。開示、訂正、削除の請求はお問い合わせフォームから受け付けます。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">4. 委託と国外移転</h2>
          <p className="mt-3 text-ink-soft">
            ホスティングやメール送信など、業務に必要な範囲で委託する可能性があります。委託先と国外移転の詳細は、運用確定後に追記します（要確認）。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">5. クッキー</h2>
          <p className="mt-3 text-ink-soft">
            サイトの動作と、運営者のログイン状態の維持に必要な範囲でクッキーを使うことがあります。広告目的の追跡は行いません。
          </p>
        </article>
        <p className="text-sm text-muted">最終更新: 2026年8月27日（草案）</p>
      </Section>
    </SiteShell>
  );
}
