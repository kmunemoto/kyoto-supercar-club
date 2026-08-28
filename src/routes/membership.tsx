import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/membership")({
  component: Page,
  head: () =>
    pageHead({
      title: "参加のご案内｜KYOTO SUPERCAR CLUB",
      description: "現在は、KSC COLLECTIONとKSC OWNER NETWORKの準備に注力しています。",
      path: "/membership",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="MEMBERSHIP"
        title="参加のご案内"
        lead="現在は、KSC COLLECTIONとKSC OWNER NETWORKの準備に注力しています。"
      />
      <Section className="max-w-3xl pt-0">
        <p className="text-ink-soft">
          共同購入の興味登録と、既存スーパーカーオーナーからの先行相談を受け付けています。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/collection"
          className="inline-flex h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          共同所有を見る
        </Link>
        <Link
          to="/owners"
          className="inline-flex h-12 items-center rounded-md border border-line px-6"
        >
          オーナーネットワークを見る
        </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
