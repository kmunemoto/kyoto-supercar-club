import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { track } from "@/lib/analytics";
import { getLineUrl } from "@/lib/site";

export function SuccessPanel({
  title,
  body,
  referenceId,
  nextSteps,
  lineNote,
}: {
  title: string;
  body: string;
  /** Shown so the visitor has something to quote when they follow up. */
  referenceId?: string | undefined;
  nextSteps?: readonly string[] | undefined;
  lineNote?: string | undefined;
}) {
  const line = getLineUrl();
  return (
    <div className="rounded-xl border border-line bg-cream px-6 py-10">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-success/15 text-success">
          <Check className="size-5" />
        </span>
        <h2 className="mt-5 font-serif text-2xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">{body}</p>
      </div>

      {nextSteps?.length ? (
        <div className="mx-auto mt-8 max-w-md border-t border-line pt-6">
          <h3 className="text-xs tracking-[0.18em] text-copper">このあとの流れ</h3>
          <ol className="mt-4 space-y-3 text-sm text-ink-soft">
            {nextSteps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="font-serif text-base tabular-nums text-copper">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {referenceId ? (
        <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted">
          受付番号 <span className="tabular-nums">{referenceId}</span>
          <br />
          お問い合わせの際にお知らせください。
        </p>
      ) : null}

      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        {line ? (
          <a
            href={line}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("line_cta_click", { place: "success" })}
            className="type-cta inline-flex h-12 min-h-12 items-center justify-center rounded-md bg-oxblood px-6 text-cream"
          >
            LINEで友だち追加する
          </a>
        ) : null}
        <Link
          to="/"
          className="type-cta inline-flex h-12 min-h-12 items-center justify-center rounded-md border border-line px-6"
        >
          トップへ戻る
        </Link>
      </div>

      {line ? (
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-muted">
          {lineNote ??
            "LINEを追加しておくと、準備の進み具合をお知らせできます。契約や購入申込ではありません。"}
        </p>
      ) : null}
    </div>
  );
}

export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        会社URL
        <input
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
