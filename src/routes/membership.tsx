import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { MEMBER_VALUES, pageTitle } from "@/lib/brand";
import { MEMBER_POINTS } from "@/lib/content";

export const Route = createFileRoute("/membership")({
  component: Page,
  head: () => ({
    meta: [
      { title: pageTitle("会員制度") },
      { name: "description", content: "完全審査・招待制。事前登録は予約ではありません。" },
    ],
  }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="MEMBERSHIP"
        title="会員制度"
        lead="安さではなく、所有する前に本当に好きな一台と出会えること。審査された会員だけで、少数の車を共有することを目指しています。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo src="/images/interior.jpg" alt="暗い車内のステアリング" className="aspect-[16/8]" />
        </div>
      </div>
      <Section>
        <ul className="grid gap-4 md:grid-cols-3">
          {MEMBER_VALUES.map((v) => (
            <li key={v} className="rounded-lg border border-line bg-cream p-6 font-serif text-xl leading-snug">
              {v}
            </li>
          ))}
        </ul>
        <div className="mt-16 space-y-10">
          {MEMBER_POINTS.map((p) => (
            <article key={p.title} className="border-t border-line pt-6">
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-3 max-w-3xl text-ink-soft">{p.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-12 text-ink-soft">
          事前登録は、興味と条件のすり合わせです。免許証のアップロードは、この段階では受け付けません。
        </p>
        <Link
          to="/apply/member"
          className="mt-8 inline-flex h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          会員事前登録をする
        </Link>
      </Section>
    </SiteShell>
  );
}
