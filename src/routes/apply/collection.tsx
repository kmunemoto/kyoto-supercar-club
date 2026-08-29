import { createFileRoute } from "@tanstack/react-router";
import { CollectionForm } from "@/components/forms/collection-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { PlanBanner } from "@/components/site/conditions";
import { LEGAL_BANNER } from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/collection")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカー共同所有｜共同オーナーの興味登録",
      description: "共同所有に関心のある方向けの、無料の興味登録です。契約や決済ではありません。",
      path: "/apply/collection",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="COLLECTION PRE-REGISTER"
        title="共同購入の興味登録"
        lead="欲しい一台へのご関心をお聞かせください。契約や決済ではありません。"
      />
      <Section className="max-w-3xl pt-0">
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <div className="mt-10">
          <CollectionForm />
        </div>
      </Section>
    </SiteShell>
  );
}
