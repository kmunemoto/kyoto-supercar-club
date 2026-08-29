/**
 * Shared between the Vite config (which writes sitemap.xml and robots.txt at
 * build time) and the app (which builds canonical, OGP and JSON-LD URLs).
 * Keeping one list means a new page cannot end up in one and not the other.
 *
 * No `import.meta.env` here: the Vite config loads this in plain Node.
 */
export const FALLBACK_SITE_URL = "https://start-your-spark-56.lovable.app";

/** Public, indexable pages. Anything noindex stays out of the sitemap. */
export const SITE_PATHS = [
  "/",
  "/about",
  "/collection",
  "/owners",
  "/how-it-works",
  "/safety",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
] as const;
