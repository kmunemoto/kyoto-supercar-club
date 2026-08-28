import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/member")({
  component: Page,
  head: () =>
    pageHead({
      title: "参加のご案内｜KYOTO SUPERCAR CLUB",
      description: "現在は、KSC COLLECTIONとKSC OWNER NETWORKの準備に注力しています。",
      path: "/apply/member",
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
        <p className="mb-8 text-ink-soft">
          共同購入の興味登録と、既存オーナーからの先行相談をご覧ください。
        </p>
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
