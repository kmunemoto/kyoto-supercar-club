import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/member")({
  component: Page,
  head: () =>
    pageHead({
      title: "一般会員向けサービスは募集停止｜KYOTO SUPERCAR CLUB",
      description: "一般会員の事前登録は停止しています。",
      path: "/apply/member",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="PAUSED"
        title="一般会員向けサービスは現在募集していません"
        lead="新規の会員事前登録は停止しています。過去にいただいた登録は保管しています。"
      />
      <Section className="max-w-3xl pt-0">
        <Link
          to="/collection"
          className="inline-flex h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          共同所有へ進む
        </Link>
      </Section>
    </SiteShell>
  );
}
