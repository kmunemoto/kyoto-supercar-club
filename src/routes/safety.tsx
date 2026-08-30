import { createFileRoute } from "@tanstack/react-router";
import { BulletList, PlanBanner } from "@/components/site/conditions";
import { PageIntro, Photo, PhotoNote, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";
import {
  ACCIDENT_POLICY,
  LEGAL_BANNER,
  DRIVER_BURDEN_ITEMS,
  DRIVING_PROHIBITED,
  OPERATOR_SIDE_RESPONSIBILITY,
  SAFETY_ITEMS,
} from "@/lib/content";

export const Route = createFileRoute("/safety")({
  component: Page,
  head: () =>
    pageHead({
      title: "安全・保険について｜KYOTO SUPERCAR CLUB",
      description: "審査、対面受け渡し、利用前後の記録。保険と契約条件は正式募集時にご案内します。",
      path: "/safety",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="SAFETY"
        title="安全・保険について"
        lead="大切な車両を共同で利用するサービスだからこそ、利用者の資格、車両ごとの利用条件、利用前後の状態を明確にします。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/wheel-lambo.jpg"
            alt="ランボルギーニ・レヴエルトのホイールとエンブレム（イメージ写真）"
            className="aspect-[16/9]"
          />
        </div>
        <PhotoNote />
      </div>
      <Section>
        <PlanBanner>{LEGAL_BANNER}</PlanBanner>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {SAFETY_ITEMS.map((s) => (
            <article key={s.title} className="border-t border-line pt-6">
              <h2 className="font-serif text-2xl">{s.title}</h2>
              <p className="mt-3 text-ink-soft">{s.body}</p>
            </article>
          ))}
        </div>
        <article className="mt-16 border-t border-line pt-10">
          <h2 className="font-serif text-3xl">事故と負担の方針</h2>
          <p className="mt-4 max-w-3xl text-ink-soft">{ACCIDENT_POLICY}</p>
          <h3 className="mt-10 font-serif text-xl">契約で定める主な利用者負担</h3>
          <ul className="mt-6 grid gap-2 md:grid-cols-2">
            {DRIVER_BURDEN_ITEMS.map((item) => (
              <li key={item} className="border-t border-line pt-3 text-sm text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 font-serif text-xl">運営が担う責任</h3>
          <ul className="mt-6 grid gap-2 md:grid-cols-2">
            {OPERATOR_SIDE_RESPONSIBILITY.map((item) => (
              <li key={item} className="border-t border-line pt-3 text-sm text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 font-serif text-xl">禁止行為</h3>
          <BulletList items={DRIVING_PROHIBITED} />
        </article>
        <aside className="mt-16 rounded-xl border border-line bg-cream p-6 md:p-8">
          <h2 className="font-serif text-xl">保証金について</h2>
          <p className="mt-3 text-ink-soft">
            COLLECTIONでは、記名運転者1人につき100万円の保証金を予定しています。保証金は退会・精算後の返還対象で、事故責任の上限ではありません。取扱いは、正式募集時の契約条件で明示します。REGISTRYは無料の登録制で、保証金はかかりません。
          </p>
        </aside>
      </Section>
    </SiteShell>
  );
}
