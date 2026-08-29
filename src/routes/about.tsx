import { createFileRoute, Link } from "@tanstack/react-router";
import { PlanBanner } from "@/components/site/conditions";
import { PageIntro, Section, SiteShell } from "@/components/site/shell";
import { BRAND } from "@/lib/brand";
import { ABOUT_OPERATOR_PENDING, ABOUT_STANCE, LEGAL_BANNER } from "@/lib/content";
import { OPERATOR } from "@/lib/operator";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  component: Page,
  head: () =>
    pageHead({
      title: "準備の現在地｜KYOTO SUPERCAR CLUB",
      description:
        "いま何が決まっていて、何が決まっていないのか。京都を拠点にする理由と、確約しないと決めていることを公開しています。",
      path: "/about",
    }),
});

/** Rendered only once the operator fields are filled in; never partly guessed. */
function OperatorFacts() {
  const rows = [
    ["名称", OPERATOR.legalName],
    ["代表者", OPERATOR.representative],
    ["所在地", OPERATOR.postalAddress],
    ["連絡先", OPERATOR.contactEmail],
    ["電話", OPERATOR.phone],
  ].filter(([, value]) => Boolean(value));

  if (rows.length === 0) {
    return <p className="mt-4 text-ink-soft">{ABOUT_OPERATOR_PENDING}</p>;
  }
  return (
    <dl className="mt-4 divide-y divide-line border-y border-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <dt className="text-sm font-medium">{label}</dt>
          <dd className="text-ink-soft">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="ABOUT"
        title="準備の現在地"
        lead={`${BRAND.name}は${BRAND.phaseLabel}です。いま何が決まっていて、何が決まっていないのかを、申し込む前に読める場所にまとめています。`}
      />
      <Section className="max-w-3xl pt-0">
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>

        <div className="mt-12 space-y-12">
          {ABOUT_STANCE.map((item) => (
            <article key={item.title}>
              <h2 className="font-serif text-2xl">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>

        <article className="mt-16 border-t border-line pt-10">
          <h2 className="font-serif text-2xl">運営</h2>
          <OperatorFacts />
        </article>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/collection"
            className="type-cta inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream"
          >
            共同所有を見る
          </Link>
          <Link
            to="/owners"
            className="type-cta inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-line px-6"
          >
            オーナーネットワークを見る
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
