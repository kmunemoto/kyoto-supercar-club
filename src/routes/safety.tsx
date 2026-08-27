import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { pageHead } from "@/lib/seo";
import { SAFETY_ITEMS } from "@/lib/content";

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
        lead="スーパーカーを預かり、他人に乗ってもらう以上、速度や見た目より先に、誰が・どこまで・どう記録するかを決める必要があります。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo src="/images/wheel.jpg" alt="濡れた路面に映るホイール" className="aspect-[16/9]" />
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
        <aside className="mt-16 rounded-xl border border-line bg-cream p-6 md:p-8">
          <h2 className="font-serif text-xl">書いていないこと</h2>
          <p className="mt-3 text-ink-soft">
            保険の補償額、免責金額、GPS機器のメーカー、整備工場名は未確定です。確約できない内容は掲載しません。管理者向けの確認事項は、運営画面の「要確認」に残しています。
          </p>
        </aside>
      </Section>
    </SiteShell>
  );
}
