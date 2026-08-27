import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const forbidden = [
  "滋賀",
  "大阪府",
  "大阪北部",
  "関西",
  "kyoto-staff",
  "VITE_STAFF_CODE",
  "kyotosupercar.club",
];
const skipDir = new Set(["node_modules", ".git", "dist", ".output", ".vinxi", "attachments"]);
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skipDir.has(name)) continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      walk(path);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs|md|xml|txt|sql|css|html|example)$/.test(name)) continue;
    if (path.includes("/supabase/migrations/")) continue;
    if (name === "check-kyoto.mjs") continue;
    const text = readFileSync(path, "utf8");
    for (const word of forbidden) {
      if (text.includes(word)) hits.push(`${path.replace(root + "/", "")}: ${word}`);
    }
  }
}

walk(join(root, "src"));
walk(join(root, "public"));
walk(root);

const schemas = readFileSync(join(root, "src/lib/schemas.ts"), "utf8");
if (!schemas.includes('"京都市"') || !schemas.includes('"京都府内（京都市以外）"')) {
  hits.push("src/lib/schemas.ts: REGIONS missing Kyoto-only options");
}
if (schemas.includes("滋賀") || schemas.includes("大阪")) {
  hits.push("src/lib/schemas.ts: leftover non-Kyoto region");
}

if (hits.length) {
  console.error("Kyoto-only check failed:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("Kyoto-only check passed.");
