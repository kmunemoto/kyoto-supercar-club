import { createFileRoute, Link } from "@tanstack/react-router";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { WebPageJsonLd } from "@/components/site/json-ld";
import { BulletList, ConditionsAccordion, PlanBanner, SpecTable } from "@/components/site/conditions";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import {
  DRIVER_BURDEN_ITEMS,
  FAQS,
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
  OWNER_PHASE,
  OWNER_PROHIBITED,
  OWNER_USE_SPECS,
  OWNER_VS_COLLECTION,
  SPECIAL_CLEANING_EXAMPLES,
} from "@/lib/content";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/owners")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカーオーナーネットワーク｜車両登録・先行相談｜KSC",
      description:
        "スーパーカー所有者限定。愛車を登録し、登録オーナー同士で他の車両を相互利用するKSC OWNER NETWORK。保管・鍵の受け渡し拠点は京都府内。現在は許認可・保険体制の確認と車両登録の先行相談を受け付けています。",
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
        LINEで相談する
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
        lead="スーパーカーオーナーだけが参加できる、登録制の相互利用ネットワーク。車両はそれぞれのオーナーが所有・保管したまま、利用申請ごとに承認し、KSCが鍵の受け取りから対面受け渡し、利用前後の確認まで管理します。保管・受け渡し拠点は京都府内です。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/keys-ferrari.jpg"
            alt="トレイに置いたフェラーリのスマートキー"
            className="aspect-[16/8]"
          />
        </div>
      </div>
      <Section>
        <PlanBanner>{OWNER_PHASE}</PlanBanner>
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

        <h2 className="mt-20 font-serif text-3xl">COLLECTIONとの違い</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-3 pr-4 font-medium">項目</th>
                <th className="py-3 pr-4 font-medium">COLLECTION</th>
                <th className="py-3 font-medium">OWNER NETWORK</th>
              </tr>
            </thead>
            <tbody>
              {OWNER_VS_COLLECTION.map((row) => (
                <tr key={row.label} className="border-b border-line align-top">
                  <td className="py-4 pr-4 font-medium">{row.label}</td>
                  <td className="py-4 pr-4 text-ink-soft">{row.collection}</td>
                  <td className="py-4 text-ink-soft">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-20 font-serif text-3xl">登録できる人</h2>
        <BulletList items={OWNER_ELIGIBILITY} />
        <p className="mt-4 max-w-3xl text-sm text-muted">
          車両価格による固定基準は設けません。車種、年式、状態、走行距離、希少性、整備、保険加入可否、維持費、運転難易度などをKSCが個別に審査します。年1回の継続安全審査があり、点検・審査費用は車両オーナー負担です。
        </p>

        <h2 className="mt-20 font-serif text-3xl">クレジット制度</h2>
        <SpecTable className="mt-8" rows={OWNER_CREDITS} />
        <p className="mt-4 text-sm text-muted">登録車両を外した場合、クレジットは一時凍結します。</p>

        <h2 className="mt-20 font-serif text-3xl">料金</h2>
        <p className="mt-4 text-sm text-muted">税込か税別かは未確定です。保証金は他車利用時のみです。</p>
        <SpecTable className="mt-8" rows={OWNER_FEES} />
        <h3 className="mt-12 font-serif text-2xl">他車利用時の保証金</h3>
        <p className="mt-4 max-w-3xl text-sm text-ink-soft">
          愛車の登録だけなら保証金はありません。他の登録車両を利用する場合に、そのクラスを初めて使う前に預けます。返還対象であり、KSCの売上ではありません。事故責任の上限でもありません。
        </p>
        <SpecTable className="mt-8" rows={OWNER_DEPOSITS} />
        <h3 className="mt-12 font-serif text-2xl">月額管理費に含むもの</h3>
        <BulletList items={OWNER_MONTHLY_INCLUDES} />
        <h3 className="mt-10 font-serif text-2xl">月額管理費に含まないもの</h3>
        <BulletList items={OWNER_MONTHLY_EXCLUDES} />
        <p className="mt-6 max-w-3xl text-sm text-ink-soft">
          他車を利用するときのKSC利用管理費（1予約1万1,000円）は、対面受け渡しと利用前後の確認、通常洗車を含みます。
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
          車両オーナーと利用者が直接連絡する必要はありません。駐車場の許可や入出庫方法は、登録時に個別確認します。
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
                    通常洗車は1予約1万1,000円のKSC利用管理費に含みます。普通に利用しただけで特別清掃費が発生する想定ではありません。利用前後の写真などで状態を確認し、専門清掃が必要になった合理的な実費を請求する方針です。
                  </p>
                  <p className="font-medium text-ink">通常洗車に含むもの</p>
                  <BulletList items={NORMAL_WASH_INCLUDES} />
                  <p className="font-medium text-ink">特別清掃の例</p>
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
              title: "事故時に契約で検討する負担",
              body: (
                <div>
                  <p>保険を優先します。すべて無条件で利用者責任、とは書いていません。</p>
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
                    重大行為を確認した場合、KSCが即時利用停止し、調査後に継続または退会を判断します。
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
          {FAQS.filter((f) =>
            [
              "COLLECTIONとOWNER NETWORKの違いは何ですか？",
              "OWNER NETWORKの月額管理費は何に使いますか？",
              "OWNER NETWORKに保証金はありますか？",
              "特別清掃費はいつ発生しますか？",
              "審査はどのように行いますか？",
              "OWNER NETWORKの車はどこに置きますか？",
            ].includes(f.q),
          ).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-xl bg-charcoal px-6 py-10 text-cream md:px-10">
          <h2 className="font-serif text-2xl">既存スーパーカーオーナーの先行相談</h2>
          <p className="mt-3 max-w-2xl text-cream/75">{OWNER_PHASE}</p>
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
              LINEで相談する
            </InquiryCta>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
