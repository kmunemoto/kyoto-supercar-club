import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Photo, Section, SiteShell } from "@/components/site/shell";
import { FaqJsonLd, SiteJsonLd } from "@/components/site/json-ld";
import { track } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";
import {
  CULTURE_PURPOSE,
  FAQS,
  HERO_PILLARS,
  OWNER_FLOW,
  OWNER_POLICY_DRAFT,
  OWNER_PROFILES,
  SAFETY_ITEMS,
} from "@/lib/content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: Home,
  head: () =>
    pageHead({
      title: "京都のスーパーカークラブ｜車両提供パートナー先行相談",
      description:
        "京都府内のスーパーカーオーナーへ。愛車の保管・維持管理と、審査制会員による活用を組み合わせたクラブを準備中。車両提供の先行相談を受け付けています。",
      path: "/",
    }),
});

function Home() {
  return (
    <SiteShell>
      <SiteJsonLd />
      <FaqJsonLd />
      <section className="relative min-h-[62dvh] overflow-hidden bg-charcoal md:min-h-[88dvh]">
        <Photo
          src="/images/hero.jpg"
          alt="雨の京都の通りに停まる赤いスーパーカー"
          className="absolute inset-0 h-full w-full object-cover object-[46%_center] md:object-center"
          priority
          width={1500}
          height={844}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/20" />
        <div className="relative mx-auto flex min-h-[62dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 text-cream md:min-h-[88dvh] md:pb-24">
          <p className="text-xs font-medium tracking-[0.28em] text-cream/80">
            京都府内限定｜サービス準備中
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.1rem] leading-[1.2] md:text-6xl">
            京都のスーパーカーオーナーへ。
            <br />
            大切な一台に、次の可能性を。
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            年間の多くをガレージで過ごす愛車を、オーナーご自身の利用を最優先にしながら、保管・維持管理と審査制会員による活用につなげる仕組みを、京都で準備しています。
          </p>
          <p className="mt-4 max-w-xl text-sm text-cream/65">
            現在は車両提供パートナーとの先行相談を受け付けています。相談だけで契約・預かり・貸出が始まることはありません。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/apply/owner"
              onClick={() => track("owner_cta_click", { place: "hero" })}
              className="inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-cream px-6 text-ink"
            >
              車両提供について相談する
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-cream/40 px-6 text-cream"
            >
              仕組みと安全方針を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_PILLARS.map((item) => (
            <div key={item.title}>
              <h2 className="font-serif text-xl">{item.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <p className="text-xs tracking-[0.22em] text-copper">FOR OWNERS</p>
        <h2 className="mt-4 max-w-3xl font-serif text-3xl md:text-4xl">
          こんなオーナー様から、お話を伺いたいと考えています。
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {OWNER_PROFILES.map((item) => (
            <li key={item} className="border-t border-line pt-4 text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="text-xs tracking-[0.22em] text-copper">UNDER REVIEW</p>
          <h2 className="mt-4 font-serif text-3xl">現在検討している方針</h2>
          <p className="mt-4 max-w-2xl text-cream/70">
            以下は確定サービスではありません。保険金額、収益額、提携先、保管施設、車両ラインナップは未確定です。
          </p>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {OWNER_POLICY_DRAFT.map((item) => (
              <li key={item} className="border-t border-cream/15 pt-3 text-sm text-cream/80">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section>
        <p className="text-xs tracking-[0.22em] text-copper">CONSULTATION</p>
        <h2 className="mt-4 font-serif text-3xl">相談の流れ</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">
          フォーム送信だけで車両登録や契約は成立しません。
        </p>
        <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {OWNER_FLOW.map((s) => (
            <li key={s.step}>
              <p className="font-serif text-2xl text-copper">{s.step}</p>
              <h3 className="mt-3 font-serif text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
        <Link
          to="/apply/owner"
          onClick={() => track("owner_cta_click", { place: "flow" })}
          className="mt-12 inline-flex h-12 min-h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          車両提供について相談する
        </Link>
      </Section>

      <section className="border-y border-line bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs tracking-[0.22em] text-copper">CARE</p>
            <h2 className="mt-4 font-serif text-3xl">安全管理の考え方</h2>
            <p className="mt-4 text-ink-soft">
              人を選び、使い方を決め、状態を残す。保険と許認可は専門家の確認が必要で、現時点では補償内容を書いていません。
            </p>
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

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <p className="text-xs tracking-[0.22em] text-copper">FOR FUTURE MEMBERS</p>
          <h2 className="mt-4 max-w-3xl font-serif text-2xl md:text-3xl">
            {CULTURE_PURPOSE.heading}
          </h2>
          <div className="mt-4 max-w-2xl space-y-3 text-ink-soft">
            {CULTURE_PURPOSE.paragraphs.slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>クラブへの参加と、スーパーカーの運転資格は別です。予約はできません。</p>
          </div>
          <Link
            to="/membership"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-oxblood"
          >
            会員制度と事前登録を見る <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-20 text-cream">
        <Photo
          src="/images/river.jpg"
          alt="夕方の川と山"
          className="absolute inset-0 opacity-40"
          width={1600}
          height={900}
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="text-xs tracking-[0.22em] text-cream/70">{BRAND.tagline}</p>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl">
            京都の一台について、まず話を聞かせてください。
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/apply/owner"
              onClick={() => track("owner_cta_click", { place: "bottom" })}
              className="inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-cream px-6 text-ink"
            >
              車両提供について相談する
            </Link>
            <Link
              to="/safety"
              className="inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-cream/40 px-6 text-cream"
            >
              仕組みと安全方針を見る
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
