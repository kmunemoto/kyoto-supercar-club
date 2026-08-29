import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(d);
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeZone: "Asia/Tokyo",
  }).format(d);
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * Every column here comes from a public form, and the export is opened in
 * Excel (the BOM below says so). A leading =, +, - or @ makes the cell a
 * formula, so a value like `=HYPERLINK(...)` would run on a staff machine.
 * Prefixing a tab keeps the text readable and stops it being parsed as one.
 */
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `\t${value}` : value;
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const escape = (v: unknown) => {
    const raw = v == null ? "" : Array.isArray(v) ? v.join(" / ") : String(v);
    const s = neutralizeFormula(raw);
    if (/[",\n\r\t]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((c) => escape(row[c])).join(",")).join("\n");
  return `\uFEFF${header}\n${body}\n`;
}

export function downloadText(filename: string, text: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function jsonList(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join("、");
  if (typeof value === "string") {
    try {
      const p = JSON.parse(value) as unknown;
      if (Array.isArray(p)) return p.map(String).join("、");
    } catch {
      return value;
    }
  }
  return value == null ? "—" : String(value);
}
