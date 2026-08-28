import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import { OPERATOR } from "@/lib/operator";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: Page,
  head: () =>
    pageHead({
      title: "プライバシーポリシー｜KYOTO SUPERCAR CLUB",
      description: "事前登録と相談でお預かりする個人情報の取扱い。",
      path: "/privacy",
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
            共同所有の事前登録、オーナーネットワークの先行相談、お問い合わせにおいて、氏名、メールアドレス、電話番号、居住または保管地域（京都市／京都府内）、車両の概要、関心事項、自己申告の運転歴、広告流入時のUTMパラメータ、参照元、自由記述を取得します。初回では、正確な保管住所、ナンバープレート、車台番号、車検証、免許証画像、資産証明は取得しません。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">2. 利用目的</h2>
          <p className="mt-3 text-ink-soft">
            お申し込みへの返答、追加確認、サービス設計のための集計、流入元の把握、法令上必要な確認に限ります。販売目的の第三者提供は行いません。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">3. 保管と開示</h2>
          <p className="mt-3 text-ink-soft">
            申込内容は、Lovable Cloud（データベース）へ保存し、staff
            テーブルに登録された運営担当者のみが管理画面で閲覧できます。一般のサイト訪問者および一般の認証ユーザーは申込一覧を閲覧できません。開示、訂正、削除の請求はお問い合わせフォームから受け付けます。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">4. 委託</h2>
          <p className="mt-3 text-ink-soft">
            ホスティング（Lovable
            Cloud）、および通知メールを設定した場合のメール配信に必要な範囲で委託します。委託先の正式名称は運用確定後に追記します。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">5. クッキーと計測</h2>
          <p className="mt-3 text-ink-soft">
            サイトの動作と、運営者ログイン状態の維持に必要な範囲でクッキーを使うことがあります。Google
            Analytics または Meta Pixel
            の識別子が設定されている場合のみ、同意後に広告・分析クッキーを読み込みます。未設定の場合は読み込みません。フォームに添付するUTM情報は、同意バナーとは別に申込データとして保存します。
          </p>
        </article>
        {OPERATOR.legalName || OPERATOR.contactEmail ? (
          <article>
            <h2 className="font-serif text-2xl">6. 運営者</h2>
            <p className="mt-3 text-ink-soft">
              {OPERATOR.legalName ? <>名称: {OPERATOR.legalName}</> : null}
              {OPERATOR.contactEmail ? (
                <>
                  <br />
                  連絡先: {OPERATOR.contactEmail}
                </>
              ) : null}
            </p>
          </article>
        ) : (
          <article>
            <h2 className="font-serif text-2xl">6. 運営者</h2>
            <p className="mt-3 text-ink-soft">
              運営者の正式名称・住所・電話番号は確認後に掲載します。現時点では架空の会社情報を記載しません。
            </p>
          </article>
        )}
      </Section>
    </SiteShell>
  );
}
