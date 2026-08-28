import { createFileRoute } from "@tanstack/react-router";
import { OwnerForm } from "@/components/forms/owner-form";
import { PlanBanner } from "@/components/site/conditions";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { OWNER_VALUE } from "@/lib/brand";
import { LEGAL_BANNER } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/owner")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカーオーナーネットワーク｜先行相談",
      description: `${OWNER_VALUE}先行相談を受け付けています。`,
      path: "/apply/owner",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="OWNER NETWORK｜既存スーパーカーオーナー限定"
        title="愛車の登録についての相談"
        lead="スーパーカー所有者の方向けです。愛車を登録し、他の登録車両を相互利用する仕組みについての先行相談です。"
      />
      <Section className="max-w-3xl pt-0">
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <div className="mt-10">
          <OwnerForm />
        </div>
      </Section>
    </SiteShell>
  );
}
