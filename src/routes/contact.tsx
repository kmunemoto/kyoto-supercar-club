import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () =>
    pageHead({
      title: "お問い合わせ｜KYOTO SUPERCAR CLUB",
      description: "取材、提携、フォームに書ききれないご質問。車両の予約依頼は受け付けていません。",
      path: "/contact",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="CONTACT"
        title="お問い合わせ"
        lead="取材、提携、フォームに書ききれないご質問はこちらから。車両の予約依頼は受け付けていません。"
      />
      <Section className="max-w-3xl pt-0">
        <ContactForm />
      </Section>
    </SiteShell>
  );
}
