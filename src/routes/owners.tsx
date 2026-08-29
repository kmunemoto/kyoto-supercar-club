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
import {
  ACCIDENT_POLICY,
  DRIVER_BURDEN_ITEMS,
  FEE_NOTE,
  LEGAL_BANNER,
  NORMAL_WASH_INCLUDES,
  OWNER_CANCEL,
  OWNER_CREDITS,
  OWNER_DELAY,
  OWNER_DEPOSITS,
  OWNER_ELIGIBILITY,
  OWNER_EXIT,
  OWNER_FEES,
  OWNER_FLOW,
  OWNER_HANDOVER_SUMMARY,
  OWNER_MONTHLY_EXCLUDES,
  OWNER_MONTHLY_INCLUDES,
  OWNER_NETWORK_POINTS,
  OWNER_OWNER_CONDITIONS,
  OWNER_PROHIBITED,
  OWNER_USE_SPECS,
  SPECIAL_CLEANING_EXAMPLES,
  faqsById,
} from "@/lib/content";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/owners")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカーオーナーネットワーク｜車両登録・先行相談｜KSC OWNER NETWORK",
      description:
        "既存スーパーカーオーナー限定。愛車を登録し、登録オーナー同士で他の車両を相互利用するKSC OWNER NETWORK。保管・鍵の受け渡し拠点は京都府内。現在は興味登録と先行相談を受け付けています。",
      path: "/owners",
    }),
});

function Ctas() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        to="/apply/owner"
        className="inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream type-cta"
      >
        愛車の登録を相談する
      </Link>
      <InquiryCta
        topic="オーナーネットワークについて"
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
        name="京都のスーパーカーオーナーネットワーク｜車両登録・先行相談"
        description="既存スーパーカーオーナー限定の登録制相互利用。先行相談受付中です。"
        path="/owners"
      />
      <PageIntro
        kicker="OWNER NETWORK｜既存スーパーカーオーナー限定"
        title="愛車を登録し、次の一台を体験する。"
        lead="審査対象となるスーパーカーを所有する方のための登録制サービスです。車両はそれぞれのオーナーが所有・保管したまま、利用申請はそのつど車両オーナーが承認します。鍵の受け取りから対面受け渡しまでは、KSCが管理します。保管・受け渡し拠点は京都府内です。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/keys-ferrari.jpg"
            alt="トレイに置いたフェラーリのスマートキー（イメージ写真）"
            className="aspect-[16/8]"
          />
        </div>
        <PhotoNote />
      </div>
      <Section>
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <p className="mt-6 max-w-3xl text-sm text-ink-soft">{BRAND.kyotoDefinition}</p>
        <p className="mt-8 max-w-3xl text-lg text-ink-soft">{OWNER_HANDOVER_SUMMARY}</p>
        <div className="mt-8">
          <Ctas />
        </div>

        <h2 className="mt-20 font-serif text-3xl">OWNER NETWORKとは</h2>
        <div className="mt-10 space-y-10">
          {OWNER_NETWORK_POINTS.map((p) => (
            <article key={p.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{p.title}</h3>
              <p className="mt-3 max-w-3xl text-ink-soft">{p.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-20 font-serif text-3xl">登録できる人</h2>
        <BulletList items={OWNER_ELIGIBILITY} />
        <p className="mt-4 max-w-3xl text-sm text-muted">
          車両価格による固定基準は設けません。車種、年式、状態、走行距離、希少性、整備状況、保険加入可否、維持費、運転難易度などをKSCが個別に審査します。年1回の継続安全審査があり、点検・審査費用は車両オーナー負担です。
        </p>

        <h2 className="mt-20 font-serif text-3xl">クレジット制度</h2>
        <SpecTable className="mt-8" rows={OWNER_CREDITS} />
        <p className="mt-4 text-sm text-muted">
          登録車両を外した場合、クレジットは一時的に凍結されます。
        </p>

        <h2 className="mt-20 font-serif text-3xl">料金</h2>
        <p className="mt-4 text-sm text-muted">{FEE_NOTE}</p>
        <SpecTable className="mt-8" rows={OWNER_FEES} />
        <h3 className="mt-12 font-serif text-2xl">他車利用時の保証金</h3>
        <p className="mt-4 max-w-3xl text-sm text-ink-soft">
          愛車の登録だけなら保証金は不要です。他の登録車両を利用する場合に、そのクラスを初めて使う前にお預かりします。退会・精算後の返還対象であり、事故時の責任上限ではありません。
        </p>
        <SpecTable className="mt-8" rows={OWNER_DEPOSITS} />
        <h3 className="mt-12 font-serif text-2xl">月額管理費に含むもの</h3>
        <BulletList items={OWNER_MONTHLY_INCLUDES} />
        <h3 className="mt-10 font-serif text-2xl">月額管理費に含まないもの</h3>
        <BulletList items={OWNER_MONTHLY_EXCLUDES} />
        <p className="mt-6 max-w-3xl text-sm text-ink-soft">
          他車を利用するときのKSC利用管理費（1予約2万2,000円）は、対面受け渡しと利用前後の確認、通常洗車を含みます。
        </p>

        <h2 className="mt-20 font-serif text-3xl">利用申請から返却まで</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          {OWNER_FLOW.map((s) => (
            <li key={s.step}>
              <p className="font-serif text-2xl text-copper">{s.step}</p>
              <h3 className="mt-3 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-sm text-muted">
          車両オーナーと利用者が直接連絡する必要はありません。駐車場の利用許可や入出庫の方法は、登録時に個別に確認します。
        </p>

        <h2 className="mt-20 font-serif text-3xl">条件・安全管理・精算</h2>
        <ConditionsAccordion
          items={[
            {
              title: "オーナーが指定できる条件",
              body: (
                <div>
                  <p>KSCの最低基準より厳しい条件を指定できます。</p>
                  <BulletList items={OWNER_OWNER_CONDITIONS} />
                </div>
              ),
            },
            {
              title: "利用の目安",
              body: <SpecTable rows={OWNER_USE_SPECS} />,
            },
            {
              title: "通常洗車と特別清掃",
              body: (
                <div className="space-y-4">
                  <p>
                    通常洗車は1予約2万2,000円のKSC利用管理費に含まれます。普通に利用しただけで特別清掃費が発生する想定ではありません。
                  </p>
                  <p className="font-medium text-ink">通常洗車に含むもの</p>
                  <BulletList items={NORMAL_WASH_INCLUDES} />
                  <p className="font-medium text-ink">特別清掃の例（合理的な実費）</p>
                  <BulletList items={SPECIAL_CLEANING_EXAMPLES} />
                </div>
              ),
            },
            {
              title: "キャンセル・遅延",
              body: (
                <div>
                  <BulletList items={OWNER_CANCEL} />
                  <p className="mt-6 font-medium text-ink">遅延</p>
                  <BulletList items={OWNER_DELAY} />
                </div>
              ),
            },
            {
              title: "事故時の精算",
              body: (
                <div>
                  <p>{ACCIDENT_POLICY}</p>
                  <BulletList items={DRIVER_BURDEN_ITEMS} />
                </div>
              ),
            },
            {
              title: "禁止行為",
              body: (
                <div>
                  <BulletList items={OWNER_PROHIBITED} />
                  <p className="mt-4">
                    重大な違反行為を確認した場合は、KSCが利用を即時停止し、調査のうえ継続または退会を判断します。
                  </p>
                </div>
              ),
            },
            {
              title: "退会・車両売却",
              body: <BulletList items={OWNER_EXIT} />,
            },
          ]}
        />

        <h2 className="mt-20 font-serif text-3xl">よくある質問</h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {faqsById([
            "owner-monthly-fee",
            "owner-deposit",
            "special-cleaning",
            "screening",
            "owner-storage",
          ]).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-xl bg-charcoal px-6 py-10 text-cream md:px-10">
          <h2 className="font-serif text-2xl">既存スーパーカーオーナーの先行相談</h2>
          <p className="mt-3 max-w-2xl text-cream/75">愛車の登録について、まず話を伺います。</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/apply/owner"
              className="inline-flex h-12 items-center justify-center rounded-md bg-cream px-6 text-ink type-cta"
            >
              愛車の登録を相談する
            </Link>
            <InquiryCta
              topic="オーナーネットワークについて"
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
