import { FALLBACK_SITE_URL, SITE_PATHS } from "../../site.config";

export { SITE_PATHS };

export function getSiteUrl(): string {
  const raw = import.meta.env["VITE_PUBLIC_SITE_URL"];
  const value = typeof raw === "string" ? raw.trim() : "";
  return (value || FALLBACK_SITE_URL).replace(/\/$/, "");
}

export function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSupabaseUrl(): string | undefined {
  const value = import.meta.env["VITE_SUPABASE_URL"];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const publishable = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  const anon = import.meta.env["VITE_SUPABASE_ANON_KEY"];
  if (typeof publishable === "string" && publishable.trim()) return publishable.trim();
  if (typeof anon === "string" && anon.trim()) return anon.trim();
  return undefined;
}

export function isCloudConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** Official LINE. Override with VITE_KSC_LINE_URL if the account changes. */
const OFFICIAL_LINE_URL = "https://line.me/ti/p/eMWqcmXxia";

/**
 * Set VITE_KSC_LINE_URL to "off" to take the LINE route down. Without it the
 * account can never be switched off, and the contact-form fallbacks that every
 * LINE CTA falls back to are unreachable code.
 */
export function getLineUrl(): string | undefined {
  const raw = import.meta.env["VITE_KSC_LINE_URL"];
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value.toLowerCase() === "off") return undefined;
  return value || OFFICIAL_LINE_URL;
}

export function lineCtaLabel(): string {
  return getLineUrl() ? "LINEで相談する" : "お問い合わせする";
}

export const OG_IMAGE = {
  path: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "雨の京都の通りに停まる赤いスーパーカー",
} as const;
