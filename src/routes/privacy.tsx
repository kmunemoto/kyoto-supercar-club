import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import { OPERATOR } from "@/lib/operator";
import { ConsentControl } from "@/components/site/consent-control";
import { PROCESSORS, RETENTION_NOTE } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: Page,
  head: () =>
    pageHead({
      title: "プライバシーポリシー｜KYOTO SUPERCAR CLUB",
      description: "興味登録と相談でお預かりする個人情報の取扱い。",
      path: "/privacy",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="PRIVACY"
        title="プライバシーポリシー"
        lead={`${BRAND.name}（以下「当サービス」）は、事前登録、先行相談、お問い合わせを通じてお預かりする個人情報を、以下の方針に基づいて取り扱います。`}
      />
      <Section className="prose-like max-w-3xl space-y-10 pt-0">
        <article>
          <h2 className="font-serif text-2xl">1. 取得する情報</h2>
          <p className="mt-3 text-ink-soft">
            共同所有の興味登録、オーナーネットワークの先行相談、お問い合わせにおいて、氏名、メールアドレス、電話番号、居住地域（京都市／京都府内／京都府外）、京都府内の車両保管地域、車両の概要、関心事項、自己申告の運転歴、広告流入時のUTMパラメータ、参照元、自由記述を取得します。初回では、正確な保管住所、ナンバープレート、車台番号、車検証、免許証画像、資産証明、保証金、決済情報は取得しません。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">2. 利用目的</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
            <li>お問い合わせへの回答</li>
            <li>興味登録・先行相談への対応</li>
            <li>サービス設計と運営改善</li>
            <li>利用状況や流入経路の把握</li>
            <li>法令上必要となる確認</li>
          </ul>
        </article>
        <article>
          <h2 className="font-serif text-2xl">3. 第三者提供</h2>
          <p className="mt-3 text-ink-soft">
            法令に基づく場合を除き、ご本人の同意なく個人情報を第三者へ提供しません。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">4. 保管と安全管理</h2>
          <p className="mt-3 text-ink-soft">
            お預かりした情報は、適切なアクセス制限を設けたシステムで管理し、業務上必要な運営担当者のみが取り扱います。個人情報の開示、訂正、削除のご請求は、お問い合わせフォームから受け付けます。ご本人であることを確認できた場合、原則として2週間以内に対応し、削除に応じたときはその旨をご連絡します。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">5. 委託先</h2>
          <p className="mt-3 text-ink-soft">
            当サービスは、以下の外部サービスに業務の一部を委託しています。いずれも必要な範囲でのみ情報を取り扱います。
          </p>
          <ul className="mt-3 space-y-2 text-ink-soft">
            {PROCESSORS.map((item) => (
              <li key={item.name}>
                <span className="font-medium text-ink">{item.name}</span>：{item.purpose}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            LINE公式アカウントからご相談いただいた場合、そのやり取りはLINEヤフー株式会社のサービス上でも取り扱われます。
          </p>
        </article>
        <article>
          <h2 className="font-serif text-2xl">6. 保存期間</h2>
          <p className="mt-3 text-ink-soft">{RETENTION_NOTE}</p>
        </article>
        <article id="cookie" className="scroll-mt-24">
          <h2 className="font-serif text-2xl">7. Cookieとアクセス解析</h2>
          <p className="mt-3 text-ink-soft">
            サイトの表示に必要なCookieのほか、利用状況の把握と広告効果の測定のためにGoogleアナリティクス（Google
            LLC）とMetaピクセル（Meta Platforms,
            Inc.）を利用する場合があります。これらは利用者の同意が得られた場合にのみ読み込みます。同意はいつでも変更できます。
          </p>
          <div className="mt-4">
            <ConsentControl />
          </div>
        </article>
        <article>
          <h2 className="font-serif text-2xl">8. 運営者</h2>
          {OPERATOR.legalName || OPERATOR.contactEmail ? (
            <p className="mt-3 text-ink-soft">
              {OPERATOR.legalName ? <>名称: {OPERATOR.legalName}</> : <>運営：{BRAND.name}</>}
              <br />
              {OPERATOR.contactEmail ? (
                <>連絡先: {OPERATOR.contactEmail}</>
              ) : (
                <>
                  個人情報に関するお問い合わせ：
                  <Link to="/contact" className="text-oxblood underline underline-offset-4">
                    お問い合わせフォーム
                  </Link>
                </>
              )}
            </p>
          ) : (
            <p className="mt-3 text-ink-soft">
              運営：{BRAND.name}
              <br />
              個人情報に関するお問い合わせ：
              <Link to="/contact" className="text-oxblood underline underline-offset-4">
                お問い合わせフォーム
              </Link>
            </p>
          )}
        </article>
      </Section>
    </SiteShell>
  );
}
