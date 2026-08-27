// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { writeFileSync } from "node:fs";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const SITE_URL = (
  process.env["VITE_PUBLIC_SITE_URL"] || "https://start-your-spark-56.lovable.app"
).replace(/\/$/, "");
const PAGES = [
  "/",
  "/collection",
  "/owners",
  "/how-it-works",
  "/safety",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

function siteMetaPlugin() {
  return {
    name: "ksc-site-meta",
    buildStart() {
      const urls = PAGES.map(
        (path) => `  <url><loc>${SITE_URL}${path === "/" ? "/" : path}</loc></url>`,
      ).join("\n");
      writeFileSync(
        "public/sitemap.xml",
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      writeFileSync(
        "public/robots.txt",
        `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /apply/\nDisallow: /membership\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
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
