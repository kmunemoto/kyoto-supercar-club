import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { CONTACT_TOPICS } from "@/lib/schemas";
import { track } from "@/lib/analytics";
import { pageHead } from "@/lib/seo";
import { getLineUrl, lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () =>
    pageHead({
      title: "お問い合わせ｜KYOTO SUPERCAR CLUB",
      description:
        "共同所有、REGISTRY、売却相談、MORNING RUN、愛車撮影、取材・提携のご質問。いまは興味登録と先行相談を受け付けています。",
      path: "/contact",
    }),
});

function Page() {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const raw = new URLSearchParams(searchStr.startsWith("?") ? searchStr.slice(1) : searchStr).get(
    "topic",
  );
  const topic = raw && (CONTACT_TOPICS as readonly string[]).includes(raw) ? raw : undefined;
  const line = getLineUrl();
  return (
    <SiteShell>
      <PageIntro
        kicker="CONTACT"
        title="お問い合わせ"
        lead="共同所有、REGISTRY、売却相談、MORNING RUN、愛車撮影、取材・提携のご質問はこちらから。"
      />
      <Section className="max-w-3xl pt-0">
        {line ? (
          <aside className="mb-12 flex flex-col items-start gap-6 rounded-xl border border-line bg-cream p-6 sm:flex-row sm:items-center">
            <img
              src="/images/line-qr.png"
              alt="公式LINEを追加するQRコード"
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
              className="size-40 rounded-md bg-white object-contain"
            />
            <div>
              <h2 className="font-serif text-2xl">LINEで相談する</h2>
              <p className="mt-2 text-sm text-ink-soft">
                共同所有の興味登録、REGISTRYの登録、その他のご相談は、公式LINEからも受け付けています。契約や購入申込ではありません。
              </p>
              <a
                href={line}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("line_cta_click", { place: "contact" })}
                className="type-cta mt-4 inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream"
              >
                {lineCtaLabel()}
              </a>
            </div>
          </aside>
        ) : null}
        <ContactForm initialTopic={topic} />
      </Section>
    </SiteShell>
  );
}
