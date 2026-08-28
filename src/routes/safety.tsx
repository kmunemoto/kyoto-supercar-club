import { createFileRoute } from "@tanstack/react-router";
import { BulletList } from "@/components/site/conditions";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";
import {
  ACCIDENT_POLICY,
  DRIVER_BURDEN_ITEMS,
  OPERATOR_SIDE_RESPONSIBILITY,
  OWNER_PROHIBITED,
  SAFETY_ITEMS,
} from "@/lib/content";

export const Route = createFileRoute("/safety")({
  component: Page,
  head: () =>
    pageHead({
      title: "安全・保険について｜KYOTO SUPERCAR CLUB",
      description:
        "審査、対面受け渡し、利用前後の記録。保険と許認可は確認中です。",
      path: "/safety",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="SAFETY"
        title="安全・保険について"
        lead="スーパーカーを預かり、他人が乗る以上、速度や見た目より先に、誰が・どこまで・どう記録するかを決める必要があります。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/wheel-lambo.jpg"
            alt="ランボルギーニ・レヴエルトのホイールとエンブレム"
            className="aspect-[16/9]"
          />
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
          <h3 className="mt-10 font-serif text-xl">契約で検討する利用者負担</h3>
          <p className="mt-3 text-sm text-muted">
            保険を優先します。すべて無条件で利用者責任、とは書いていません。補償額は未確定です。
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
          <h3 className="mt-10 font-serif text-xl">禁止行為</h3>
          <BulletList items={OWNER_PROHIBITED} />
        </article>
        <aside className="mt-16 rounded-xl border border-line bg-cream p-6 md:p-8">
          <h2 className="font-serif text-xl">保証金について</h2>
          <p className="mt-3 text-ink-soft">
            COLLECTIONでは、記名運転者1人につき100万円の保証金を予定しています。事故責任の上限ではありません。OWNER
            NETWORKでは保証金制度を使いません。保証金がなくても、事故時の利用者責任がなくなるわけではありません。
          </p>
          <p className="mt-4 text-ink-soft">
            保険の補償額と免責金額は未確定です。「保険に入っているので何があっても安心」「事故はすべて運転者が払う」といった断定はしません。審査内容により、KSCから追加確認をお願いする場合があります。
          </p>
        </aside>
      </Section>
    </SiteShell>
  );
}
