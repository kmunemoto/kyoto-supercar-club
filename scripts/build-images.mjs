/**
 * Regenerates the responsive variants that `Photo` (src/components/site/shell.tsx)
 * expects: `<name>-<width>.avif`, `.webp`, and a `-1500.jpg` fallback.
 *
 * Not part of `npm run build` — the outputs are committed, so this only needs
 * running when a source photo is added or replaced:
 *
 *   npm i --no-save sharp && node scripts/build-images.mjs
 *
 * Put the full-resolution original in assets/photos/ and list it below.
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { join } from "node:path";

const DIR = join(import.meta.dirname, "..", "public", "images");
// Originals live outside public/ so they are versioned but never deployed.
const SRC = join(import.meta.dirname, "..", "assets", "photos");

/** Matches PHOTO_WIDTHS in shell.tsx. */
const WIDTHS = [900, 1500];

const SOURCES = [
  { file: "hero.jpg" },
  { file: "garage-revuelto.jpg" },
  { file: "interior-720s-front.jpg" },
  { file: "keys-ferrari.jpg" },
  { file: "wheel-lambo.jpg" },
  // Decorative wash behind text at opacity-40; detail is not visible.
  { file: "river.jpg", quality: 62 },
];

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

for (const { file, quality = 74 } of SOURCES) {
  const src = join(SRC, file);
  try {
    await stat(src);
  } catch {
    console.warn(`skip ${file}: put the original in assets/photos/`);
    continue;
  }
  const base = file.replace(/\.jpg$/, "");
  for (const w of WIDTHS) {
    const resized = () => sharp(src).resize({ width: w, withoutEnlargement: true });
    await resized()
      .avif({ quality: quality - 12, effort: 6 })
      .toFile(join(DIR, `${base}-${w}.avif`));
    await resized()
      .webp({ quality })
      .toFile(join(DIR, `${base}-${w}.webp`));
  }
  const fallback = join(DIR, `${base}-1500.jpg`);
  await sharp(src)
    .resize({ width: 1500, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(fallback);
  console.log(
    `${base}: ${kb((await stat(fallback)).size)} jpeg fallback + avif/webp at ${WIDTHS.join("/")}`,
  );
}

// Scanned by a camera, so JPEG artefacts hurt: PNG is both crisper and smaller.
const qr = join(SRC, "line-qr.jpg");
try {
  await stat(qr);
  await sharp(qr)
    .resize({ width: 480 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(DIR, "line-qr.png"));
  console.log(`line-qr.png: ${kb((await stat(join(DIR, "line-qr.png"))).size)}`);
} catch {
  console.warn("skip line-qr: put the original in assets/photos/");
}
