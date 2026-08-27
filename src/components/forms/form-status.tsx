import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export function SuccessPanel({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-cream px-6 py-10 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-success/15 text-success">
        <Check className="size-5" />
      </span>
      <h2 className="mt-5 font-serif text-2xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">{body}</p>
      <Link to="/" className="mt-8 inline-flex h-12 items-center rounded-md bg-oxblood px-6 text-cream">
        トップへ戻る
      </Link>
    </div>
  );
}

export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        会社URL
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
