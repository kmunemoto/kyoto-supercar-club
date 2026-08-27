import { createFileRoute } from "@tanstack/react-router";
import { OwnerForm } from "@/components/forms/owner-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { OWNER_VALUE } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/owner")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカー車両提供・保管相談｜KYOTO SUPERCAR CLUB",
      description: `${OWNER_VALUE}。京都府内限定の先行相談。契約や預かりは始まりません。`,
      path: "/apply/owner",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="OWNER INQUIRY"
        title="車両提供について相談する"
        lead="京都府内のスーパーカーオーナーから、車両提供の先行相談を受け付けています。送信は相談の受付であり、預かり契約ではありません。"
      />
      <Section className="max-w-3xl pt-0">
        <OwnerForm />
      </Section>
    </SiteShell>
  );
}
