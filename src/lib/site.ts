const FALLBACK_SITE_URL = "https://start-your-spark-56.lovable.app";

export const SITE_PATHS = [
  "/",
  "/owners",
  "/how-it-works",
  "/safety",
  "/membership",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
] as const;

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

export function allowLocalStore(): boolean {
  return import.meta.env.DEV && import.meta.env["VITE_ALLOW_LOCAL_STORE"] === "true";
}

export const OG_IMAGE = {
  path: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "雨の京都の通りに停まる赤いスーパーカー",
} as const;
