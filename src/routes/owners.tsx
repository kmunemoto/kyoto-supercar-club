import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import { OWNER_VALUE } from "@/lib/brand";
import { pageHead } from "@/lib/seo";
import { OWNER_BENEFITS } from "@/lib/content";

export const Route = createFileRoute("/owners")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカー車両提供・保管相談｜KYOTO SUPERCAR CLUB",
      description:
        "京都 スーパーカークラブとして、スーパーカー 車両提供とスーパーカー 保管 京都、高級車 保管 京都、スーパーカー 維持管理の先行相談を受け付けています。保管サービス提供中ではありません。",
      path: "/owners",
    }),
});

function Page() {
  return (
    <SiteShell>
      <PageIntro
        kicker="FOR OWNERS"
        title="車両オーナーの方へ"
        lead={`${OWNER_VALUE}。稼ぐことを前面に出すサービスではありません。預かり開始は、相談のあと、条件が合う場合に限ります。`}
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo
            src="/images/garage.jpg"
            alt="カバーをかけた車のある保管庫"
            className="aspect-[16/8]"
          />
        </div>
      </div>
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          {OWNER_BENEFITS.map((b) => (
            <article key={b.title} className="border-t border-line pt-6">
              <h2 className="font-serif text-2xl">{b.title}</h2>
              <p className="mt-3 text-ink-soft">{b.body}</p>
            </article>
          ))}
        </div>
        <aside className="mt-16 rounded-xl bg-charcoal px-6 py-8 text-cream md:px-10">
          <h2 className="font-serif text-2xl">金額について</h2>
          <p className="mt-3 max-w-2xl text-cream/75">
            固定報酬、利用実績による分配のいずれも、額は未確定です。相談フォームでは希望の方式だけ伺います。サイト上で収益を約束する表示はしません。
          </p>
        </aside>
        <Link
          to="/apply/owner"
          className="mt-10 inline-flex h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          車両提供について相談する
        </Link>
      </Section>
    </SiteShell>
  );
}
