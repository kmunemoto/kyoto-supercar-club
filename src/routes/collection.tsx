import { createFileRoute, Link } from "@tanstack/react-router";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { WebPageJsonLd } from "@/components/site/json-ld";
import {
  BulletList,
  ConditionsAccordion,
  PlanBanner,
  SpecTable,
} from "@/components/site/conditions";
import { PageIntro, Photo, PhotoNote, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import {
  COLLECTION_CORE,
  COLLECTION_DUTIES,
  COLLECTION_ELIGIBILITY,
  COLLECTION_EXIT,
  COLLECTION_FEE_TIMING,
  COLLECTION_FLOW,
  COLLECTION_GOVERNANCE,
  COLLECTION_HANDOVER,
  COLLECTION_HEADCOUNT,
  COLLECTION_HOLDING_DEPOSIT,
  COLLECTION_IDEA,
  COLLECTION_INHERITANCE,
  COLLECTION_LEAD_SUPPLEMENT,
  COLLECTION_PLAN_FEES,
  COLLECTION_REPAIR,
  COLLECTION_RESERVE_LEAD,
  COLLECTION_RESERVE_NON_USES,
  COLLECTION_RESERVE_USES,
  COLLECTION_RISKS,
  COLLECTION_SOURCING,
  COLLECTION_SOURCING_COMMON,
  COLLECTION_USED_ONLY,
  COLLECTION_UNPAID,
  COLLECTION_USE_ALLOCATION,
  COLLECTION_USE_SPECS,
  faqsById,
  FEE_NOTE,
  LEGAL_BANNER,
  NORMAL_WASH_INCLUDES,
  SPECIAL_CLEANING_EXAMPLES,
  INVESTMENT_NOTE,
  VALUE_CHECK,
  VALUE_CHECK_HEADLINE,
  VALUE_CHECK_HEADLINE_NOTE,
} from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/collection")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都でスーパーカーを共同所有｜KSC COLLECTION",
      description: `欲しい一台を少人数で共同購入するKSC COLLECTION。${VALUE_CHECK_HEADLINE}1人あたりの購入負担は車両ごとに設計します。いまは無料の興味登録のみです。`,
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
        共同購入の興味登録をする
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
        description="欲しい一台を少人数で共同購入・共同所有する構想。いまは無料の興味登録のみです。"
        path="/collection"
      />
      <PageIntro
        kicker="COLLECTION｜興味登録受付"
        title="欲しい一台を、少人数で共同購入する。"
        lead={COLLECTION_CORE}
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/garage-revuelto.jpg"
            alt="木目のガレージに置かれたランボルギーニ・レヴエルト（イメージ写真）"
            className="aspect-[16/8]"
          />
        </div>
        <PhotoNote />
      </div>
      <Section>
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <p className="mt-12 text-xs font-medium tracking-[0.22em] text-copper">
          KSC VALUE CHECK｜最低基準
        </p>
        <p className="mt-4 max-w-3xl font-serif text-2xl leading-snug md:text-[2rem]">
          {VALUE_CHECK_HEADLINE}
        </p>
        <p className="mt-5 max-w-3xl leading-relaxed text-ink-soft">{VALUE_CHECK_HEADLINE_NOTE}</p>
        <p className="mt-6 max-w-3xl text-ink-soft">{COLLECTION_LEAD_SUPPLEMENT}</p>
        <p className="mt-4 max-w-3xl text-sm text-ink-soft">{BRAND.kyotoDefinition}</p>
        <div className="mt-8">
          <Ctas />
        </div>

        <h2 className="mt-20 font-serif text-3xl">共同所有の考え方</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {COLLECTION_IDEA.map((item) => (
            <article key={item.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <h2 className="mt-20 font-serif text-3xl">{COLLECTION_HEADCOUNT.heading}</h2>
        <p className="mt-4 max-w-3xl text-ink-soft">{COLLECTION_HEADCOUNT.body}</p>
        <p className="mt-4 max-w-3xl text-ink-soft">{COLLECTION_HEADCOUNT.range}</p>

        <h2 className="mt-20 font-serif text-3xl">車両の探しかた</h2>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">{COLLECTION_USED_ONLY}</p>
        <p className="mt-4 max-w-3xl text-ink-soft">{COLLECTION_SOURCING_COMMON}</p>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {COLLECTION_SOURCING.map((item) => (
            <article key={item.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-20 font-serif text-3xl">{VALUE_CHECK.heading}</h2>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">{VALUE_CHECK.lead}</p>
        <p className="mt-4 max-w-3xl text-ink-soft">{VALUE_CHECK.purpose}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VALUE_CHECK.criteria.map((item) => (
            <article key={item.label} className="rounded-xl border border-line bg-cream px-5 py-6">
              <p className="text-xs tracking-[0.18em] text-copper">{item.label}</p>
              <p className="mt-3 font-serif text-xl leading-snug">{item.value}</p>
            </article>
          ))}
        </div>
        <h3 className="mt-12 font-serif text-2xl">比較に含めるもの</h3>
        <BulletList items={VALUE_CHECK.items} />
        <p className="mt-6 max-w-3xl text-ink-soft">{VALUE_CHECK.kmNote}</p>
        <h3 className="mt-12 font-serif text-2xl">再販の3シナリオ</h3>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {VALUE_CHECK.scenarios.map((item) => (
            <article key={item.title} className="border-t border-line pt-5">
              <h4 className="font-serif text-xl">{item.title}</h4>
              <p className="mt-3 text-sm text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
        <h3 className="mt-12 font-serif text-2xl">基準を満たさないとき</h3>
        <BulletList items={VALUE_CHECK.ifNotMet} />
        <p className="mt-6 max-w-3xl text-sm text-muted">{VALUE_CHECK.disclaimer}</p>
        <div className="mt-8">
          <PlanBanner>{INVESTMENT_NOTE}</PlanBanner>
        </div>

        <h2 className="mt-20 font-serif text-3xl">予定する基本条件</h2>
        <p className="mt-4 text-sm text-muted">{FEE_NOTE}</p>
        <SpecTable className="mt-8" rows={COLLECTION_PLAN_FEES} />
        <h3 className="mt-12 font-serif text-2xl">年間利用日数と走行距離の設計例</h3>
        <p className="mt-4 max-w-3xl text-ink-soft">{COLLECTION_USE_ALLOCATION.lead}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {COLLECTION_USE_ALLOCATION.rows.map((row) => (
            <article key={row.owners} className="rounded-xl border border-line bg-cream px-5 py-6">
              <p className="text-xs tracking-[0.18em] text-copper">共同オーナー {row.owners}</p>
              <p className="mt-3 font-serif text-xl">年 {row.days}</p>
              <p className="mt-1 text-ink-soft">{row.km}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted">{COLLECTION_USE_ALLOCATION.note}</p>
        <h3 className="mt-12 font-serif text-2xl">料金が発生する時期</h3>
        <SpecTable className="mt-8" rows={COLLECTION_FEE_TIMING} />

        <h2 className="mt-20 font-serif text-3xl">参加申込預り金</h2>
        <BulletList items={COLLECTION_HOLDING_DEPOSIT} />

        <h2 className="mt-20 font-serif text-3xl">初期共有予備資金</h2>
        <p className="mt-4 max-w-3xl text-ink-soft">{COLLECTION_RESERVE_LEAD}</p>
        <h3 className="mt-10 font-serif text-xl">使うもの</h3>
        <BulletList items={COLLECTION_RESERVE_USES} />
        <h3 className="mt-8 font-serif text-xl">使わないもの</h3>
        <BulletList items={COLLECTION_RESERVE_NON_USES} />

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
                  <p>
                    通常洗車は予約管理の一環として手配します。普通に利用しただけで特別清掃費が発生する想定ではありません。
                  </p>
                  <p className="font-medium text-ink">通常洗車に含むもの</p>
                  <BulletList items={NORMAL_WASH_INCLUDES} />
                  <p className="font-medium text-ink">特別清掃の例（合理的な実費）</p>
                  <BulletList items={SPECIAL_CLEANING_EXAMPLES} />
                </div>
              ),
            },
            {
              title: "修理の判断",
              body: <BulletList items={COLLECTION_REPAIR} />,
            },
            {
              title: "議決",
              body: <BulletList items={COLLECTION_GOVERNANCE} />,
            },
            {
              title: "最低参加期間と退出",
              body: <BulletList items={COLLECTION_EXIT} />,
            },
            {
              title: "相続",
              body: <BulletList items={COLLECTION_INHERITANCE} />,
            },
            {
              title: "未払い",
              body: <BulletList items={COLLECTION_UNPAID} />,
            },
          ]}
        />

        <h2 className="mt-20 font-serif text-3xl">事前に理解しておきたいこと</h2>
        <BulletList items={COLLECTION_RISKS} />

        <h2 className="mt-20 font-serif text-3xl">よくある質問</h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {faqsById([
            "who-buys",
            "used-only",
            "collection-storage",
            "investment",
            "collection-fees",
            "per-owner-cost",
            "owner-count",
            "value-check",
            "application-deposit",
            "share-transfer",
            "kyoto-residency",
          ]).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-xl bg-charcoal px-6 py-10 text-cream md:px-10">
          <h2 className="font-serif text-2xl">共同購入の興味登録</h2>
          <p className="mt-3 max-w-2xl text-cream/75">
            欲しい一台への関心を伺います。契約や決済ではありません。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/apply/collection"
              className="inline-flex h-12 items-center justify-center rounded-md bg-cream px-6 text-ink type-cta"
            >
              共同購入の興味登録をする
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
