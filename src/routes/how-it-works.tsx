import { createFileRoute, Link } from "@tanstack/react-router";
import { PlanBanner } from "@/components/site/conditions";
import { PageIntro, Photo, PhotoNote, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import { HOW_IT_WORKS, LEGAL_BANNER, OWNER_VS_COLLECTION } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
  component: Page,
  head: () =>
    pageHead({
      title: "2つのサービスの違い｜KYOTO SUPERCAR CLUB",
      description: `${BRAND.name}の共同購入と、既存オーナー限定の相互利用の違い。いまは興味登録と先行相談を受け付けています。`,
      path: "/how-it-works",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="HOW IT WORKS"
        title="2つのサービスの違い"
        lead="京都を拠点に、共同購入とオーナー同士の相互利用を準備しています。居住地は問いません。"
      />
      <div className="mx-auto max-w-6xl px-5 pb-8">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/interior-720s-front.jpg"
            alt="マクラーレン720Sのステアリングと、フロントガラス越しの京都・祇園（イメージ写真）"
            className="aspect-[16/9]"
          />
        </div>
        <PhotoNote />
      </div>
      <Section>
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <article className="border-t border-line pt-6">
            <p className="text-xs tracking-[0.22em] text-copper">KSC COLLECTION</p>
            <h2 className="mt-3 font-serif text-2xl">共同購入・共同所有</h2>
            <p className="mt-4 text-ink-soft">
              欲しい一台を、少人数で共同購入する仕組みです。運転できるのはその車両の審査済み共同オーナーだけです。
            </p>
          </article>
          <article className="border-t border-line pt-6">
            <p className="text-xs tracking-[0.22em] text-copper">KSC OWNER NETWORK</p>
            <h2 className="mt-3 font-serif text-2xl">愛車登録・相互利用</h2>
            <p className="mt-4 text-ink-soft">
              審査対象となるスーパーカーを所有する方のための登録制サービスです。登録オーナー同士が、車両ごとの条件と承認に基づいて利用します。
            </p>
          </article>
        </div>

        <h2 className="mt-20 font-serif text-3xl">比較</h2>
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

        <h2 className="mt-20 font-serif text-3xl">いまの段階</h2>
        <ol className="mt-10 grid gap-12 md:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <li key={s.step} className="border-t border-copper/40 pt-6">
              <p className="font-serif text-3xl text-copper">{s.step}</p>
              <h3 className="mt-4 font-serif text-2xl">{s.title}</h3>
              <p className="mt-3 text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12">
          <Link to="/collection" className="text-oxblood">
            共同購入を見る
          </Link>
          <span className="mx-3 text-muted">/</span>
          <Link to="/owners" className="text-oxblood">
            愛車の登録を見る
          </Link>
        </p>
      </Section>
    </SiteShell>
  );
}
