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
      title: "KSC REGISTRY｜愛車の無料登録",
      description: `${OWNER_VALUE}`,
      path: "/apply/owner",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="KSC REGISTRY｜既存スーパーカーオーナー限定・無料"
        title="愛車の無料登録"
        lead="スーパーカー所有者の方向けです。費用は一切かかりません。車両は登録後もご自身で所有・保管いただきます。"
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
