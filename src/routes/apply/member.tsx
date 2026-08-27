import { createFileRoute } from "@tanstack/react-router";
import { MemberForm } from "@/components/forms/member-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/apply/member")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都の会員制スーパーカーシェア｜会員事前登録",
      description:
        "見る・知る入口と、運転する会員を分けた事前登録。サービス開始前、予約はできません。",
      path: "/apply/member",
      noindex: true,
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="PRE-REGISTER"
        title="会員事前登録"
        lead="クラブへの参加希望を受け付けます。見る・知る入口と、運転する会員は別です。いまは予約できません。免許証などの書類は、このフォームでは送りません。"
      />
      <Section className="max-w-3xl pt-0">
        <MemberForm />
      </Section>
    </SiteShell>
  );
}
