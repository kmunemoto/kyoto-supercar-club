import { createFileRoute } from "@tanstack/react-router";
import { MemberForm } from "@/components/forms/member-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageTitle } from "@/lib/brand";

export const Route = createFileRoute("/apply/member")({
  component: Page,
  head: () => ({
    meta: [
      { title: pageTitle("会員事前登録") },
      { name: "description", content: "招待制サービスの事前登録。予約ではありません。" },
    ],
  }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="PRE-REGISTER"
        title="会員事前登録"
        lead="所有する前に、本当に好きな一台と出会うための登録です。いまは予約できません。免許証などの書類は、このフォームでは送りません。"
      />
      <Section className="max-w-3xl pt-0">
        <MemberForm />
      </Section>
    </SiteShell>
  );
}
