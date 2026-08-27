import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { HOW_IT_WORKS } from "@/lib/content";

export const Route = createFileRoute("/how-it-works")({
  component: Page,
  head: () =>
    pageHead({
      title: "仕組み｜KYOTO SUPERCAR CLUB",
      description: `${BRAND.name}の準備段階での流れ。相談、確認、開始判断。`,
      path: "/how-it-works",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="HOW IT WORKS"
        title="サービスの仕組み"
        lead="まだ車を貸し出す段階ではありません。いま集めているのは、車両を預けたい方の相談と、将来の会員候補の声です。"
      />
      <div className="mx-auto max-w-6xl px-5 pb-8">
        <div className="overflow-hidden rounded-xl">
          <Photo src="/images/keys.jpg" alt="ロゴのないキーと茶器" className="aspect-[16/8]" />
        </div>
      </div>
      <Section>
        <ol className="grid gap-12 md:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <li key={s.step} className="border-t border-copper/40 pt-6">
              <p className="font-serif text-3xl text-copper">{s.step}</p>
              <h2 className="mt-4 font-serif text-2xl">{s.title}</h2>
              <p className="mt-3 text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-8 border-t border-line pt-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl">想定している規模</h2>
            <p className="mt-4 text-ink-soft">
              開始時は車両2台前後、オーナー2名、会員20〜30名、1回3時間単位を目安に検討しています。数字は方針であり、確定した募集枠ではありません。
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">これから足す機能</h2>
            <p className="mt-4 text-ink-soft">
              空き状況、予約承認、決済、走行距離、利用前後の写真、整備履歴などは、許認可の見通しが立ってから実装します。今回のサイトはその土台です。
            </p>
          </div>
        </div>
        <p className="mt-12">
          <Link to="/apply/member" className="text-oxblood">
            事前登録へ進む
          </Link>
          <span className="mx-3 text-muted">/</span>
          <Link to="/apply/owner" className="text-oxblood">
            車両提供の相談へ
          </Link>
        </p>
      </Section>
    </SiteShell>
  );
}
