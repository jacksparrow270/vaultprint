/**
 * Image transcoder — PNG → AVIF + WebP at IDENTICAL dimensions.
 * Preserves original resolution (no resize) so displayed size + retina quality
 * are unchanged. Only the codec changes, cutting transferred bytes ~80%.
 *
 * Run:  node scripts/optimize-images.mjs
 */
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "../public");


// High-quality, visually-lossless settings. effort/quality tuned to keep
// perceived quality identical while maximizing compression.
const AVIF = { quality: 62, effort: 6 };   // AVIF is perceptually ~lossless here
const WEBP = { quality: 82, effort: 6 };   // WebP fallback, slightly higher q

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function run() {
  const entries = await readdir(PUBLIC_DIR);
  const pngs = entries.filter((f) => extname(f).toLowerCase() === ".png");

  if (!pngs.length) {
    console.log("No PNG files found in /public.");
    return;
  }

  for (const file of pngs) {
    const src = join(PUBLIC_DIR, file);
    const name = basename(file, ".png");
    const avifOut = join(PUBLIC_DIR, `${name}.avif`);
    const webpOut = join(PUBLIC_DIR, `${name}.webp`);

    const origSize = (await stat(src)).size;
    const input = sharp(src);
    const meta = await input.metadata();

    // No resize — keep native pixel dimensions (retina preserved).
    await input.clone().avif(AVIF).toFile(avifOut);
    await input.clone().webp(WEBP).toFile(webpOut);

    const avifSize = (await stat(avifOut)).size;
    const webpSize = (await stat(webpOut)).size;
    const saved = (1 - avifSize / origSize) * 100;

    console.log(
      `${file}  ${meta.width}x${meta.height}\n` +
        `   png:  ${kb(origSize)}\n` +
        `   avif: ${kb(avifSize)}  (-${saved.toFixed(0)}%)\n` +
        `   webp: ${kb(webpSize)}`,
    );
  }

  console.log("\nDone. AVIF + WebP written alongside originals in /public.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
