import { createFileRoute, Link } from "@tanstack/react-router";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { OWNER_FLOW, OWNER_NETWORK_POINTS } from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/owners")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカーオーナーネットワーク｜KSC",
      description:
        "愛車を登録し、登録オーナー同士で相互利用する構想。共同所有ではありません。一般会員への貸し出しは行いません。先行相談受付中。",
      path: "/owners",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="OWNER NETWORK"
        title="愛車を登録し、他のオーナー車両へ。"
        lead="すでにスーパーカーを所有している方向けです。愛車をKSCへ登録し、登録オーナー同士で他の車両を相互利用する仕組みを準備しています。共同所有ではなく、各車両は元のオーナーが所有したままです。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo src="/images/keys.jpg" alt="ロゴのないキーと茶器" className="aspect-[16/8]" />
        </div>
      </div>
      <Section>
        <p className="max-w-3xl text-ink-soft">
          一般の方への貸し出しは行いません。相互利用は確約していません。現在は準備中で、先行相談のみ受け付けています。
        </p>
        <div className="mt-16 space-y-10">
          {OWNER_NETWORK_POINTS.map((p) => (
            <article key={p.title} className="border-t border-line pt-6">
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-3 max-w-3xl text-ink-soft">{p.body}</p>
            </article>
          ))}
        </div>
        <h2 className="mt-20 font-serif text-3xl">相談の流れ</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {OWNER_FLOW.map((s) => (
            <li key={s.step}>
              <p className="font-serif text-2xl text-copper">{s.step}</p>
              <h3 className="mt-3 font-serif text-xl">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/apply/owner"
            className="inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream"
          >
            オーナーネットワークの先行相談
          </Link>
          <InquiryCta
            topic="オーナーネットワークについて"
            className="inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-line px-6"
          >
            {lineCtaLabel()}（オーナーネットワーク）
          </InquiryCta>
        </div>
      </Section>
    </SiteShell>
  );
}
