import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Photo, Section, SiteShell } from "@/components/site/shell";
import { BRAND, MEMBER_VALUES, OWNER_VALUE } from "@/lib/brand";
import { FAQS, HOW_IT_WORKS, SAFETY_ITEMS } from "@/lib/content";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: `${BRAND.name} — ${BRAND.phaseLabel}` },
      {
        name: "description",
        content:
          "京都発の招待制スーパーカーシェア。サービス準備中。車両提供の先行相談と会員事前登録を受け付けています。",
      },
    ],
  }),
});

function Home() {
  return (
    <SiteShell>
      <section className="relative min-h-[88dvh] overflow-hidden bg-charcoal">
        <Photo
          src="/images/hero.jpg"
          alt="雨の京都の通りに停まる、エンブレムのない暗いクーペ"
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/20" />
        <div className="relative mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 text-cream md:pb-24">
          <p className="text-xs font-medium tracking-[0.28em] text-cream/80">{BRAND.phaseLabel}</p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.35rem] leading-[1.15] md:text-6xl">
            所有の前に、
            <br />
            一台と向き合う。
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            {BRAND.name}は、あまり乗られていないスーパーカーをオーナーからお預かりし、審査した会員へ届ける招待制の仕組みを、京都から準備しています。
          </p>
          <p className="mt-4 max-w-xl text-sm text-cream/65">{BRAND.phaseNote}</p>
        </div>
      </section>

      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          <Link
            to="/apply/owner"
            className="group flex flex-col gap-5 border-b border-line px-5 py-12 md:border-b-0 md:border-r md:px-10 md:py-16"
          >
            <p className="text-xs tracking-[0.22em] text-copper">FOR OWNERS</p>
            <h2 className="font-serif text-3xl">車両提供について相談する</h2>
            <p className="max-w-md text-ink-soft">{OWNER_VALUE}。先行相談のみで、預かりはまだ開始していません。</p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-oxblood">
              相談フォームへ <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            to="/apply/member"
            className="group flex flex-col gap-5 px-5 py-12 md:px-10 md:py-16"
          >
            <p className="text-xs tracking-[0.22em] text-copper">FOR MEMBERS</p>
            <h2 className="font-serif text-3xl">会員事前登録をする</h2>
            <p className="max-w-md text-ink-soft">{MEMBER_VALUES[0]}。審査は開始前の登録であり、予約ではありません。</p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-oxblood">
              事前登録へ <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs tracking-[0.22em] text-copper">KYOTO / QUIETLY</p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl">派手さより、状態と人。</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              スーパーカーは、乗られない時間のほうが長いことがあります。置き場所、バッテリー、埃、保険。乗る人を限れば、車はもっと長く、静かに良い状態でいられるはずです。
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              私たちは料金や台数を先に約束しません。許認可と保険が整い、少数の車と少数の会員で始められるところまで、準備を進めます。
            </p>
          </div>
          <div className="overflow-hidden rounded-xl">
            <Photo src="/images/alley.jpg" alt="青い時間の京都の路地" className="aspect-[3/4] md:aspect-[4/5]" />
          </div>
        </div>
      </Section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="text-xs tracking-[0.22em] text-copper">HOW IT WORKS</p>
          <h2 className="mt-4 font-serif text-3xl">いまできること</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.step}>
                <p className="font-serif text-2xl text-copper">{s.step}</p>
                <h3 className="mt-3 font-serif text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section className="grid gap-16 lg:grid-cols-2">
        <article>
          <div className="overflow-hidden rounded-xl">
            <Photo src="/images/garage.jpg" alt="静かな屋内保管庫" className="aspect-[16/10]" />
          </div>
          <h2 className="mt-8 font-serif text-3xl">オーナーの方へ</h2>
          <p className="mt-4 text-ink-soft">{OWNER_VALUE}。</p>
          <Link to="/owners" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-oxblood">
            案内を読む <ArrowRight className="size-4" />
          </Link>
        </article>
        <article>
          <div className="overflow-hidden rounded-xl">
            <Photo src="/images/interior.jpg" alt="匿名のステアリングと計器" className="aspect-[16/10]" />
          </div>
          <h2 className="mt-8 font-serif text-3xl">乗りたい方へ</h2>
          <ul className="mt-4 space-y-2 text-ink-soft">
            {MEMBER_VALUES.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <Link to="/membership" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-oxblood">
            会員制度を見る <ArrowRight className="size-4" />
          </Link>
        </article>
      </Section>

      <section className="border-y border-line bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs tracking-[0.22em] text-copper">CARE</p>
            <h2 className="mt-4 font-serif text-3xl">安全管理の考え方</h2>
            <p className="mt-4 text-ink-soft">人を選び、使い方を決め、状態を残す。保険と許認可は専門家の確認が必要で、現時点では補償内容を書いていません。</p>
          </div>
          <ul className="space-y-6">
            {SAFETY_ITEMS.map((s) => (
              <li key={s.title} className="border-t border-line pt-5">
                <h3 className="font-serif text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section>
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-3xl">よくある質問</h2>
          <Link to="/faq" className="text-sm text-oxblood">
            すべて見る
          </Link>
        </div>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {FAQS.slice(0, 4).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <section className="relative overflow-hidden bg-charcoal py-20 text-cream">
        <Photo
          src="/images/river.jpg"
          alt="夕方の川と山"
          className="absolute inset-0 opacity-40"
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="text-xs tracking-[0.22em] text-cream/70">{BRAND.tagline}</p>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl">準備のあいだに、声を聞かせてください。</h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/apply/owner"
              className="inline-flex h-12 items-center justify-center rounded-md bg-cream px-6 text-ink"
            >
              車両提供の相談
            </Link>
            <Link
              to="/apply/member"
              className="inline-flex h-12 items-center justify-center rounded-md border border-cream/40 px-6 text-cream"
            >
              会員事前登録
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
