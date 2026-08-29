// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { writeFileSync } from "node:fs";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { FALLBACK_SITE_URL, SITE_PATHS } from "./site.config";

const CONFIGURED_SITE_URL = process.env["VITE_PUBLIC_SITE_URL"];
const SITE_URL = (CONFIGURED_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");
const PAGES = SITE_PATHS;

function siteMetaPlugin() {
  return {
    name: "ksc-site-meta",
    buildStart() {
      if (!CONFIGURED_SITE_URL) {
        // Every canonical, the sitemap and the OGP URLs are built from this.
        // Shipping a custom domain without it hands the whole site's search
        // equity back to the Lovable preview URL.
        console.warn(
          `[ksc] VITE_PUBLIC_SITE_URL is not set; canonical URLs and sitemap.xml will point at ${FALLBACK_SITE_URL}`,
        );
      }
      const urls = PAGES.map(
        (path) => `  <url><loc>${SITE_URL}${path === "/" ? "/" : path}</loc></url>`,
      ).join("\n");
      writeFileSync(
        "public/sitemap.xml",
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      writeFileSync(
        "public/robots.txt",
        [
          "User-agent: *",
          "Allow: /",
          // /apply/* and /membership are noindex; a Disallow would stop crawlers
          // from ever reading that tag, leaving the URLs indexable by link alone.
          "Disallow: /admin",
          "Disallow: /login",
          "",
          `Sitemap: ${SITE_URL}/sitemap.xml`,
          "",
        ].join("\n"),
      );
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [siteMetaPlugin()],
  },
});
