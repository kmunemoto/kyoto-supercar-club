import { createFileRoute } from "@tanstack/react-router";
import { OwnerForm } from "@/components/forms/owner-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { OWNER_VALUE, pageTitle } from "@/lib/brand";

export const Route = createFileRoute("/apply/owner")({
  component: Page,
  head: () => ({
    meta: [
      { title: pageTitle("車両提供の相談") },
      { name: "description", content: `${OWNER_VALUE}。先行相談のみ。` },
    ],
  }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="OWNER INQUIRY"
        title="車両提供について相談する"
        lead={`${OWNER_VALUE}。送信は相談の受付であり、預かり契約ではありません。金額や車種ラインナップは未確定です。`}
      />
      <Section className="max-w-3xl pt-0">
        <OwnerForm />
      </Section>
    </SiteShell>
  );
}
