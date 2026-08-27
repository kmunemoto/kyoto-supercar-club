import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/membership")({
  component: Page,
  head: () =>
    pageHead({
      title: "一般会員向けサービスは募集停止｜KYOTO SUPERCAR CLUB",
      description: "一般会員向けスーパーカーシェアは現在募集していません。",
      path: "/membership",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="PAUSED"
        title="一般会員向けサービスは現在募集していません"
        lead="既存オーナーの車を一般会員へ貸し出す事業は、現在保留しています。新規の会員事前登録は受け付けていません。"
      />
      <Section className="max-w-3xl pt-0">
        <p className="text-ink-soft">
          いま準備しているのは、少人数での共同所有と、オーナー同士の相互利用です。
        </p>
        <Link
          to="/collection"
          className="mt-8 inline-flex h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          共同所有（COLLECTION）を見る
        </Link>
      </Section>
    </SiteShell>
  );
}
