import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function PlanBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-3xl border-l-2 border-copper pl-4 text-sm leading-relaxed text-ink-soft">
      {children}
    </p>
  );
}

export function SpecTable({
  rows,
  className,
}: {
  rows: readonly { label: string; value: string }[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-line border-y border-line", className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 md:grid-cols-[14rem_1fr]"
        >
          <dt className="text-sm font-medium">{row.label}</dt>
          <dd className="text-ink-soft">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 max-w-3xl space-y-2 text-ink-soft">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ConditionsAccordion({
  items,
}: {
  items: readonly { title: string; body: ReactNode }[];
}) {
  return (
    <Accordion type="multiple" className="mt-8 border-t border-line">
      {items.map((item) => (
        <AccordionItem key={item.title} value={item.title} className="border-line">
          <AccordionTrigger className="font-serif text-lg text-ink hover:no-underline md:text-xl">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-ink-soft">
            {item.body}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
