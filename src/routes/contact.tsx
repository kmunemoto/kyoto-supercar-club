import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { CONTACT_TOPICS } from "@/lib/schemas";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () =>
    pageHead({
      title: "お問い合わせ｜KYOTO SUPERCAR CLUB",
      description:
        "共同所有、オーナーネットワーク、取材・提携のご質問。車両の予約依頼は受け付けていません。",
      path: "/contact",
    }),
});

function Page() {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const raw = new URLSearchParams(searchStr.startsWith("?") ? searchStr.slice(1) : searchStr).get(
    "topic",
  );
  const topic = raw && (CONTACT_TOPICS as readonly string[]).includes(raw) ? raw : undefined;
  return (
    <SiteShell>
      <PageIntro
        kicker="CONTACT"
        title="お問い合わせ"
        lead="共同所有、オーナーネットワーク、取材・提携のご質問はこちらから。車両の予約依頼は受け付けていません。"
      />
      <Section className="max-w-3xl pt-0">
        <ContactForm initialTopic={topic} />
      </Section>
    </SiteShell>
  );
}
