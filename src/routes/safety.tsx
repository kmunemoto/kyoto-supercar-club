import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";
import {
  ACCIDENT_POLICY,
  DRIVER_BURDEN_ITEMS,
  OPERATOR_SIDE_RESPONSIBILITY,
  SAFETY_ITEMS,
} from "@/lib/content";

export const Route = createFileRoute("/safety")({
  component: Page,
  head: () =>
    pageHead({
      title: "安全管理｜KYOTO SUPERCAR CLUB",
      description: "人を選び、使い方を決め、状態を残す。保険と許認可は確認中です。",
      path: "/safety",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="SAFETY"
        title="安全管理"
        lead="スーパーカーを預かり、他人が乗る以上、速度や見た目より先に、誰が・どこまで・どう記録するかを決める必要があります。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo src="/images/wheel-lambo.jpg" alt="ランボルギーニ・レヴエルトのホイールとエンブレム" className="aspect-[16/9]" />
        </div>
      </div>
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
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
          <h3 className="mt-10 font-serif text-xl">将来の契約で検討する運転者負担</h3>
          <p className="mt-3 text-sm text-muted">
            いずれも、法令上認められる範囲で、運転者の責めに帰すべき場合に限ります。金額は未確定です。
          </p>
          <ul className="mt-6 grid gap-2 md:grid-cols-2">
            {DRIVER_BURDEN_ITEMS.map((item) => (
              <li key={item} className="border-t border-line pt-3 text-sm text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 font-serif text-xl">運転者へ転嫁しない内容</h3>
          <ul className="mt-6 grid gap-2 md:grid-cols-2">
            {OPERATOR_SIDE_RESPONSIBILITY.map((item) => (
              <li key={item} className="border-t border-line pt-3 text-sm text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
        </article>
        <aside className="mt-16 rounded-xl border border-line bg-cream p-6 md:p-8">
          <h2 className="font-serif text-xl">書いていないこと</h2>
          <p className="mt-3 text-ink-soft">
            保険の補償額、免責金額、保証金、車種、1口価格は未確定です。「保険に入っているので何があっても安心」「事故はすべて運転者が払う」といった断定はしません。
          </p>
        </aside>
      </Section>
    </SiteShell>
  );
}
