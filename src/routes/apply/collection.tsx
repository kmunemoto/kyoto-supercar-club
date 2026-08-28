import { createFileRoute } from "@tanstack/react-router";
import { CollectionForm } from "@/components/forms/collection-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/collection")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカー共同所有｜共同オーナー興味登録",
      description: "共同所有に関心がある人の無料の興味登録。契約・購入・出資ではありません。参加申込預り金は受け取りません。",
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
        lead="共同所有に関心があることの確認です。契約、購入申込、出資申込、予約ではありません。車両代と参加申込預り金は受け取りません。"
      />
      <Section className="max-w-3xl pt-0">
        <CollectionForm />
      </Section>
    </SiteShell>
  );
}
