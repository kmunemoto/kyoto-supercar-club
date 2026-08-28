import { createFileRoute, Link } from "@tanstack/react-router";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { WebPageJsonLd } from "@/components/site/json-ld";
import { BulletList, ConditionsAccordion, PlanBanner, SpecTable } from "@/components/site/conditions";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import {
  COLLECTION_DUTIES,
  COLLECTION_ELIGIBILITY,
  COLLECTION_EXIT,
  COLLECTION_FIRST_CAR,
  COLLECTION_FLOW,
  COLLECTION_HANDOVER,
  COLLECTION_IDEA,
  COLLECTION_PHASE,
  COLLECTION_PLAN_FEES,
  COLLECTION_RISKS,
  COLLECTION_UNDECIDED,
  COLLECTION_USE_SPECS,
  FAQS,
  NORMAL_WASH_INCLUDES,
  SPECIAL_CLEANING_EXAMPLES,
} from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/collection")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都でスーパーカーを共同所有｜KSC COLLECTION",
      description:
        "6人で一台のスーパーカーを共同購入・共同所有するKSC COLLECTION。1人約500万円、年間24日の利用を基本計画として、京都で共同オーナー候補の興味登録を受け付けています。",
      path: "/collection",
    }),
});

function Ctas() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        to="/apply/collection"
        className="inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream type-cta"
      >
        共同購入の事前登録をする
      </Link>
      <InquiryCta
        topic="共同所有について"
        className="inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-line px-6 type-cta"
      >
        {lineCtaLabel()}
      </InquiryCta>
    </div>
  );
}

function Page() {
  return (
    <SiteShell>
      <WebPageJsonLd
        name="京都でスーパーカーを共同所有｜KSC COLLECTION"
        description="6人で一台のスーパーカーを共同購入・共同所有する構想。いまは興味登録のみです。"
        path="/collection"
      />
      <PageIntro
        kicker="COLLECTION｜興味登録受付"
        title="欲しい一台を、6人で共同購入する。"
        lead="参加者6人が購入資金を出し、車両を共同所有する仕組みです。KSCが選定、保管、予約、受け渡しを管理します。一般会員へは貸し出しません。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/garage-revuelto.jpg"
            alt="木目のガレージに置かれたランボルギーニ・レヴエルト"
            className="aspect-[16/8]"
          />
        </div>
      </div>
      <Section>
        <PlanBanner>{COLLECTION_PHASE}</PlanBanner>
        <div className="mt-8">
          <Ctas />
        </div>
        <p className="mt-4 text-sm text-muted">契約・購入・出資ではありません。代金は受け取りません。</p>

        <h2 className="mt-20 font-serif text-3xl">共同所有の考え方</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {COLLECTION_IDEA.map((item) => (
            <article key={item.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-ink-soft">{COLLECTION_FIRST_CAR}</p>

        <h2 className="mt-20 font-serif text-3xl">予定する基本条件</h2>
        <p className="mt-4 text-sm text-muted">税込か税別かは未確定です。金額を勝手に税込表示していません。</p>
        <SpecTable className="mt-8" rows={COLLECTION_PLAN_FEES} />

        <h2 className="mt-20 font-serif text-3xl">車両決定の流れ</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          {COLLECTION_FLOW.map((s) => (
            <li key={s.step}>
              <p className="font-serif text-2xl text-copper">{s.step}</p>
              <h3 className="mt-2 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted">
          正式募集期間は90日。6人集まらない場合は全員同意で30日延長。成立しない場合は申込金を返金する計画です。現在は申込金を受け取りません。
        </p>

        <h2 className="mt-20 font-serif text-3xl">KSCが担当すること</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {COLLECTION_DUTIES.map((item) => (
            <li key={item.title} className="border-t border-line pt-4">
              <h3 className="font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-20 font-serif text-3xl">利用・資格・退出</h2>
        <ConditionsAccordion
          items={[
            {
              title: "利用条件",
              body: <SpecTable rows={COLLECTION_USE_SPECS} />,
            },
            {
              title: "参加資格",
              body: <BulletList items={COLLECTION_ELIGIBILITY} />,
            },
            {
              title: "受け渡しと返却",
              body: <BulletList items={COLLECTION_HANDOVER} />,
            },
            {
              title: "通常洗車と特別清掃",
              body: (
                <div className="space-y-4">
                  <p>通常洗車は予約管理の一環として手配します。普通に利用しただけで特別清掃費が発生する想定ではありません。</p>
                  <p className="font-medium text-ink">通常洗車に含むもの</p>
                  <BulletList items={NORMAL_WASH_INCLUDES} />
                  <p className="font-medium text-ink">特別清掃の例（合理的な実費）</p>
                  <BulletList items={SPECIAL_CLEANING_EXAMPLES} />
                </div>
              ),
            },
            {
              title: "最低参加期間と退出",
              body: <BulletList items={COLLECTION_EXIT} />,
            },
          ]}
        />

        <h2 className="mt-20 font-serif text-3xl">共同オーナーが事前に理解するリスク</h2>
        <BulletList items={COLLECTION_RISKS} />

        <h2 className="mt-20 font-serif text-3xl">いま断定しないこと</h2>
        <p className="mt-4 text-sm text-muted">正式契約前のため、確定事項としては表示しません。</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {COLLECTION_UNDECIDED.map((item) => (
            <li key={item} className="border-t border-line pt-3 text-ink-soft">
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-20 font-serif text-3xl">よくある質問</h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {FAQS.filter((f) =>
            [
              "今すぐ車を借りられますか？",
              "KSCが車を買って、利用権だけ売るのですか？",
              "投資になりますか？",
              "いま代金や申込金は必要ですか？",
              "COLLECTIONの費用はいくらですか？",
              "審査はどのように行いますか？",
            ].includes(f.q),
          ).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-xl bg-charcoal px-6 py-10 text-cream md:px-10">
          <h2 className="font-serif text-2xl">共同購入の事前登録</h2>
          <p className="mt-3 max-w-2xl text-cream/75">
            関心のある方の意向確認です。契約でも予約でもありません。申込金は受け取りません。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/apply/collection"
              className="inline-flex h-12 items-center justify-center rounded-md bg-cream px-6 text-ink type-cta"
            >
              共同購入の事前登録をする
            </Link>
            <InquiryCta
              topic="共同所有について"
              className="inline-flex h-12 items-center justify-center rounded-md border border-cream/40 px-6 text-cream type-cta"
            >
              {lineCtaLabel()}
            </InquiryCta>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
