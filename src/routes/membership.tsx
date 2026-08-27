import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";
import {
  ACCIDENT_POLICY,
  CULTURE_EVENTS,
  CULTURE_PURPOSE,
  MEMBER_POINTS,
  MEMBER_TIERS,
} from "@/lib/content";

export const Route = createFileRoute("/membership")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都の会員制スーパーカーシェア｜会員事前登録",
      description:
        "見る・知る入口と、運転する会員を分けた招待制クラブ。サービス開始前、車両未確定、予約不可です。",
      path: "/membership",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="MEMBERSHIP"
        title="会員制度"
        lead="クラブへの参加と、スーパーカーの運転資格は別です。若い世代も、車に詳しくなくても参加できます。すぐに運転できるわけではありません。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/interior.jpg"
            alt="暗い車内のステアリング"
            className="aspect-[16/8]"
          />
        </div>
      </div>
      <Section>
        <h2 className="font-serif text-3xl">{CULTURE_PURPOSE.heading}</h2>
        <div className="mt-6 max-w-3xl space-y-4 text-ink-soft">
          {CULTURE_PURPOSE.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {MEMBER_TIERS.map((tier) => (
            <article key={tier.title} className="rounded-xl border border-line bg-cream p-6 md:p-8">
              <p className="text-xs tracking-[0.22em] text-copper">{tier.kicker}</p>
              <h2 className="mt-3 font-serif text-2xl">{tier.title}</h2>
              <p className="mt-4 text-ink-soft">{tier.body}</p>
              <p className="mt-4 text-sm text-muted">{tier.note}</p>
            </article>
          ))}
        </div>
        <h3 className="mt-16 font-serif text-2xl">構想している入口</h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {CULTURE_EVENTS.map((item) => (
            <li key={item} className="border-t border-line pt-3 text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">開催内容・料金・対象年齢は未確定です。</p>
        <div className="mt-16 space-y-10">
          {MEMBER_POINTS.map((p) => (
            <article key={p.title} className="border-t border-line pt-6">
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-3 max-w-3xl text-ink-soft">{p.body}</p>
            </article>
          ))}
        </div>
        <aside className="mt-16 rounded-xl bg-charcoal px-6 py-8 text-cream md:px-10">
          <h2 className="font-serif text-2xl">事故と保険について</h2>
          <p className="mt-3 max-w-3xl text-cream/75">{ACCIDENT_POLICY}</p>
        </aside>
        <p className="mt-12 text-ink-soft">
          事前登録は興味のすり合わせです。免許証のアップロードは、この段階では受け付けません。
        </p>
        <Link
          to="/apply/member"
          className="mt-8 inline-flex h-12 min-h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          会員事前登録をする
        </Link>
      </Section>
    </SiteShell>
  );
}
