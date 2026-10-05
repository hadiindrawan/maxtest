// Optimises the recolored art into public/characters and writes lib/character-manifest.json.
// Usage: node scripts/build-characters.mjs
// Uses the `sharp` that Next.js already installs; re-run after the owner supplies final art
// (regenerate the recolors first with docs/superpowers/assets/landing-redesign/tools/recolor-rocket.js).
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "docs/superpowers/assets/landing-redesign/characters";
const OUT = "public/characters";
const VARIANTS = ["", "-noexhaust"];

const JOBS = [
  ...["main", "idle", "smile"].flatMap((pose) =>
    VARIANTS.map((v) => ({ from: `lime-${pose}${v}.png`, to: `max-${pose}${v}.png`, height: pose === "main" ? 480 : 300 })),
  ),
  ...["writer", "runner", "detective", "scribe", "reporter", "guard", "pass", "fail"].flatMap((role) =>
    VARIANTS.map((v) => ({ from: `cast-${role}${v}.png`, to: `cast-${role}${v}.png`, height: 220 })),
  ),
];

await mkdir(OUT, { recursive: true });
const manifest = {};
for (const job of JOBS) {
  const { data, info } = await sharp(path.join(SRC, job.from))
    .resize({ height: job.height, withoutEnlargement: true })
    .png({ palette: true, quality: 90, effort: 10, colours: 128 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, job.to), data);
  manifest[job.to] = { width: info.width, height: info.height };
  console.log(job.to.padEnd(32), `${info.width}x${info.height}`.padEnd(10), `${(data.length / 1024).toFixed(1)} KB`);
}
await writeFile("lib/character-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
