import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
        ) : (
          <span className="ml-2 text-xs font-normal text-muted">任意</span>
        )}
      </label>
      {children}
      {hint ? <p className="text-sm leading-relaxed text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-oxblood" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-base leading-snug", className)}>
      {children}
    </label>
  );
}

export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "mt-1 size-5 shrink-0 rounded-sm border-line text-oxblood accent-oxblood",
        className,
      )}
      {...props}
    />
  );
}
