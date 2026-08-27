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
      description: `${BRAND.name}の準備段階での流れ。共同所有とオーナーネットワークの関心受付。`,
      path: "/how-it-works",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="HOW IT WORKS"
        title="サービスの仕組み"
        lead="まだ車を貸し出す段階ではありません。いま集めているのは、共同所有への関心と、既存オーナーからの相談です。"
      />
      <div className="mx-auto max-w-6xl px-5 pb-8">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/interior-720s-kyoto.jpg"
            alt="マクラーレン720Sのステアリングとメーター、フロントガラス越しの京都・祇園"
            className="aspect-[16/9]"
          />
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
        <p className="mt-12 text-ink-soft">
          交流会、イベント、ツーリングは現時点では実施しません。
        </p>
        <p className="mt-12">
          <Link to="/collection" className="text-oxblood">
            共同所有へ
          </Link>
          <span className="mx-3 text-muted">/</span>
          <Link to="/owners" className="text-oxblood">
            オーナーネットワークへ
          </Link>
        </p>
      </Section>
    </SiteShell>
  );
}
