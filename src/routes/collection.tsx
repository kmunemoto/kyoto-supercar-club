import { createFileRoute, Link } from "@tanstack/react-router";
import { InquiryCta } from "@/components/site/inquiry-cta";
import { WebPageJsonLd } from "@/components/site/json-ld";
import { PageIntro, Photo, Section, SiteShell } from "@/components/site/shell";
import {
  COLLECTION_DUTIES,
  COLLECTION_FLOW,
  COLLECTION_IDEA,
  COLLECTION_RISKS,
  COLLECTION_UNDECIDED,
  FAQS,
} from "@/lib/content";
import { pageHead } from "@/lib/seo";
import { lineCtaLabel } from "@/lib/site";

export const Route = createFileRoute("/collection")({
  component: Page,
  head: () =>
    pageHead({
      title: "京都のスーパーカー共同所有｜KSC COLLECTION",
      description:
        "一台を少人数で共同所有し、KSCが保管と管理を担う構想。投資商品ではありません。サービス準備中、事前登録のみ。",
      path: "/collection",
    }),
});

function Page() {
  return (
    <SiteShell>
      <WebPageJsonLd
        name="京都のスーパーカー共同所有｜KSC COLLECTION"
        description="一台を少人数で共同所有し、KSCが保管と管理を担う構想。投資商品ではありません。サービス準備中、事前登録のみ。"
        path="/collection"
      />
      <PageIntro
        kicker="COLLECTION｜サービス準備中"
        title="一台を、少人数で所有する。"
        lead="複数の参加者が車両代を負担し、共有持分を持つ構想です。KSCが管理します。いまはサービス準備中で、共同オーナー候補の事前登録だけ受け付けています。"
      />
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-xl">
          <Photo src="/images/garage.jpg" alt="屋内に置かれたランボルギーニ・レヴエルト" className="aspect-[16/8]" />
        </div>
      </div>
      <Section>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/apply/collection"
            className={`inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream type-cta`}
          >
            共同オーナー候補の事前登録
          </Link>
          <InquiryCta
            topic="共同所有について"
            className={`inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-line px-6 type-cta`}
          >
            {lineCtaLabel()}（共同所有）
          </InquiryCta>
        </div>
        <p className="mt-4 text-sm text-muted">
          契約・購入・出資ではありません。代金は受け取りません。
        </p>

        <h2 className="mt-20 font-serif text-3xl">共同所有の考え方</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {COLLECTION_IDEA.map((item) => (
            <article key={item.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-20 font-serif text-3xl">想定する流れ</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          {COLLECTION_FLOW.map((s) => (
            <li key={s.step}>
              <p className="font-serif text-2xl text-copper">{s.step}</p>
              <h3 className="mt-2 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-20 font-serif text-3xl">KSCが担当すること</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {COLLECTION_DUTIES.map((item) => (
            <li key={item.title} className="border-t border-line pt-4">
              <h3 className="font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-20 font-serif text-3xl">共同オーナーが事前に理解するリスク</h2>
        <ul className="mt-6 max-w-3xl space-y-3 text-ink-soft">
          {COLLECTION_RISKS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-20 font-serif text-3xl">未確定事項</h2>
        <p className="mt-4 text-sm text-muted">確定事項として表示しません。</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {COLLECTION_UNDECIDED.map((item) => (
            <li key={item} className="border-t border-line pt-3 text-ink-soft">
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-20 font-serif text-3xl">よくある質問</h2>
        <dl className="mt-8 divide-y divide-line border-y border-line">
          {FAQS.filter((f) =>
            [
              "今すぐ車を借りられますか？",
              "KSCが車を買って、利用権だけ売るのですか？",
              "投資になりますか？",
              "いま代金や申込金は必要ですか？",
            ].includes(f.q),
          ).map((f) => (
            <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[0.9fr_1.3fr]">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 rounded-xl bg-charcoal px-6 py-10 text-cream md:px-10">
          <h2 className="font-serif text-2xl">共同オーナー候補の事前登録</h2>
          <p className="mt-3 max-w-2xl text-cream/75">
            関心のある方の意向確認です。契約でも予約でもありません。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/apply/collection"
              className={`inline-flex h-12 items-center justify-center rounded-md bg-cream px-6 text-ink type-cta`}
            >
              事前登録をする
            </Link>
            <InquiryCta
              topic="共同所有について"
              className={`inline-flex h-12 items-center justify-center rounded-md border border-cream/40 px-6 text-cream type-cta`}
            >
              {lineCtaLabel()}（共同所有）
            </InquiryCta>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
