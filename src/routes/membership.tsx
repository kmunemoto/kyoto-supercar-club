import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { PlanBanner } from "@/components/site/conditions";
import { LEGAL_BANNER } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/membership")({
  component: Page,
  head: () =>
    pageHead({
      title: "参加のご案内｜KYOTO SUPERCAR CLUB",
      description: "現在は、KSC COLLECTIONとKSC REGISTRYの準備に注力しています。",
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
        lead="現在は、KSC COLLECTIONとKSC REGISTRYの準備に注力しています。"
      />
      <Section className="max-w-3xl pt-0">
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <p className="mt-8 text-ink-soft">
          いま受け付けているのは、共同購入の興味登録と、既存スーパーカーオーナーからの先行相談の2つです。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/collection"
            className="type-cta inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream"
          >
            共同所有を見る
          </Link>
          <Link
            to="/owners"
            className="type-cta inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-line px-6"
          >
            REGISTRYを見る
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
