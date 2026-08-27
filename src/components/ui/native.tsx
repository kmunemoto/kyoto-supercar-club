import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md border border-line bg-cream px-4 text-base text-ink placeholder:text-muted/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:border-oxblood",
        "disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg border border-line bg-cream px-4 py-3 text-base text-ink placeholder:text-muted/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:border-oxblood",
        "disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export function NativeSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-md border border-line bg-cream px-4 text-base text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:border-oxblood",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
