/**
 * Stock combo pipeline — every stock layout × every vinyl, through the SAME
 * generation module Custom Mode uses, into a review folder for approval.
 *
 *   npm run stock:generate                                  all combos
 *   npm run stock:generate -- --layout lakeview             one layout
 *   npm run stock:generate -- --sku granite-tan             one vinyl
 *   npm run stock:generate -- --layout lakeview --sku granite-tan --force
 *                                       regenerate a single combo (approval pass)
 *   npm run stock:approve  -- lakeview__granite-tan …       promote combos
 *   npm run stock:approve  -- --all                         promote everything
 *
 * Generate writes to visualizer-review/ (gitignored) and SKIPS combos that
 * already have a review file unless --force — re-running is cheap. Approve
 * moves files into public/images/visualizer/stock/ and rewrites
 * src/config/stockCombos.ts from what is actually on disk.
 */

import { copyFile, mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { generateDeckRender } from "../src/lib/visualizer/generate";
import { STOCK_LAYOUTS, LIMITS } from "../src/config/visualizer";
import { VINYLS } from "../src/config/vinyls";
import { logGeneration } from "../src/lib/visualizer/usage";

const ROOT = path.join(import.meta.dirname, "..");
const REVIEW_DIR = path.join(ROOT, "visualizer-review");
const PUBLIC_DIR = path.join(ROOT, "public", "images", "visualizer", "stock");
const MANIFEST = path.join(ROOT, "src", "config", "stockCombos.ts");

// Outside the Next runtime nothing loads .env.local — do it by hand
async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !(match[1] in process.env)) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env.local — rely on the shell environment
  }
}

function parseArgs(argv: string[]) {
  const args = {
    layout: "",
    sku: "",
    force: false,
    approve: false,
    all: false,
    combos: [] as string[],
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--layout") args.layout = argv[++i] ?? "";
    else if (arg === "--sku") args.sku = argv[++i] ?? "";
    else if (arg === "--force") args.force = true;
    else if (arg === "--approve") args.approve = true;
    else if (arg === "--all") args.all = true;
    else if (!arg.startsWith("--")) args.combos.push(arg.replace(/\.webp$/, ""));
  }
  return args;
}

async function generateAll(layoutFilter: string, skuFilter: string, force: boolean) {
  await loadEnv();
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing — set it in .env.local");
    process.exit(1);
  }
  await mkdir(REVIEW_DIR, { recursive: true });

  const layouts = STOCK_LAYOUTS.filter((l) => !layoutFilter || l.id === layoutFilter);
  const vinyls = VINYLS.filter((v) => !skuFilter || v.sku === skuFilter);
  if (layouts.length === 0 || vinyls.length === 0) {
    console.error("Nothing matches that --layout/--sku. Check the ids in src/config.");
    process.exit(1);
  }

  console.log(`${layouts.length} layout(s) × ${vinyls.length} vinyl(s) = ${layouts.length * vinyls.length} combo(s)\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const layout of layouts) {
    // Same pipeline as Custom Mode: downscale to the working resolution,
    // re-encode (EXIF gone), then hand both images to the model
    const deckPhoto = await sharp(path.join(ROOT, "public", layout.photoPath))
      .rotate()
      .resize(LIMITS.workingEdgePx, LIMITS.workingEdgePx, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88 })
      .toBuffer();

    for (const vinyl of vinyls) {
      const combo = `${layout.id}__${vinyl.sku}`;
      const outFile = path.join(REVIEW_DIR, `${combo}.webp`);
      if (!force && existsSync(outFile)) {
        console.log(`· ${combo} — review file exists, skipping (use --force to redo)`);
        skipped++;
        continue;
      }

      const swatch = await readFile(path.join(ROOT, "public", vinyl.swatchPath));
      const started = Date.now();
      process.stdout.write(`⏳ ${combo} … `);
      try {
        const result = await generateDeckRender({
          deckPhoto,
          deckPhotoMime: "image/webp",
          vinylSwatch: swatch,
          vinylSwatchMime: "image/jpeg",
        });
        await writeFile(outFile, await sharp(result.image).webp({ quality: 90 }).toBuffer());
        await logGeneration({
          at: new Date().toISOString(),
          ip: "script",
          sku: vinyl.sku,
          source: layout.id,
          success: true,
          latencyMs: Date.now() - started,
        });
        console.log(`done in ${Math.round((Date.now() - started) / 1000)}s`);
        generated++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await logGeneration({
          at: new Date().toISOString(),
          ip: "script",
          sku: vinyl.sku,
          source: layout.id,
          success: false,
          latencyMs: Date.now() - started,
          error: message.slice(0, 300),
        });
        console.log(`FAILED — ${message}`);
        failed++;
      }
    }
  }

  console.log(`\n${generated} generated, ${skipped} skipped, ${failed} failed.`);
  console.log(`Review the images in visualizer-review/, then promote keepers with:`);
  console.log(`  npm run stock:approve -- --all      (or name combos individually)`);
}

async function approve(combos: string[], all: boolean) {
  await mkdir(PUBLIC_DIR, { recursive: true });

  let names = combos;
  if (all) {
    names = (await readdir(REVIEW_DIR).catch(() => []))
      .filter((f) => f.endsWith(".webp"))
      .map((f) => f.replace(/\.webp$/, ""));
  }
  if (names.length === 0) {
    console.error("Nothing to approve. Name combos (layoutId__sku) or pass --all.");
    process.exit(1);
  }

  for (const name of names) {
    const source = path.join(REVIEW_DIR, `${name}.webp`);
    if (!existsSync(source)) {
      console.error(`✗ ${name} — no review file, skipping`);
      continue;
    }
    await copyFile(source, path.join(PUBLIC_DIR, `${name}.webp`));
    await unlink(source);
    console.log(`✓ ${name} → public${path.sep}images${path.sep}visualizer${path.sep}stock`);
  }

  // The manifest mirrors the public dir — never hand-maintained
  const approved = (await readdir(PUBLIC_DIR))
    .filter((f) => f.endsWith(".webp"))
    .map((f) => f.replace(/\.webp$/, ""))
    .sort();

  await writeFile(
    MANIFEST,
    `/**
 * Which stock combos have an APPROVED render in
 * /public/images/visualizer/stock. Maintained by the approval step of
 * scripts/generate-stock-combos.ts — run it with --approve and this list
 * is rewritten from what's actually on disk. Do not edit by hand.
 *
 * The UI treats a missing combo as "preview being prepared" and shows the
 * base layout photo, so shipping with a partial list is safe.
 */

export const STOCK_COMBOS: string[] = ${JSON.stringify(approved, null, 2)};

export function hasStockCombo(layoutId: string, sku: string): boolean {
  return STOCK_COMBOS.includes(\`\${layoutId}__\${sku}\`);
}
`,
  );
  console.log(`\nManifest updated: ${approved.length} approved combo(s).`);
}

const args = parseArgs(process.argv.slice(2));
if (args.approve || args.combos.length > 0 || args.all) {
  approve(args.combos, args.all);
} else {
  generateAll(args.layout, args.sku, args.force);
}
