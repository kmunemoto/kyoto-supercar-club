/**
 * Shared between the Vite config (which writes sitemap.xml and robots.txt at
 * build time) and the app (which builds canonical, OGP and JSON-LD URLs).
 * Keeping one list means a new page cannot end up in one and not the other.
 *
 * No `import.meta.env` here: the Vite config loads this in plain Node.
 */
/**
 * Used when VITE_PUBLIC_SITE_URL is unset, which is the case today — so this is
 * the URL every canonical, sitemap entry and OGP tag actually carries. It must
 * match the deployed subdomain or the live site declares a canonical pointing
 * somewhere else.
 */
export const FALLBACK_SITE_URL = "https://kyoto-supercar-club.lovable.app";

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
