import { createFileRoute } from "@tanstack/react-router";
import { OwnerForm } from "@/components/forms/owner-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { OWNER_VALUE } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/owner")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカーオーナーネットワーク｜先行相談",
      description: `${OWNER_VALUE}。京都府内限定の先行相談。登録や相互利用は始まりません。`,
      path: "/apply/owner",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="OWNER NETWORK"
        title="オーナーネットワークの先行相談"
        lead="スーパーカー所有者の方向けです。愛車の登録と、登録オーナー同士の相互利用について相談を受け付けます。送信は相談の受付であり、登録の確定ではありません。"
      />
      <Section className="max-w-3xl pt-0">
        <OwnerForm />
      </Section>
    </SiteShell>
  );
}
