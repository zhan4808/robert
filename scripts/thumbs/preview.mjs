#!/usr/bin/env node
/**
 * Renders every thumbnail to PNG the way the strip shows it: over the dark tile and the light one, at the width of
 * a strip tile and of a hover card, so the set can be checked by eye.
 *
 *   node scripts/thumbs/preview.mjs <out-dir> [slug ...]
 */
import { mkdir, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const THUMBS = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "thumbs");

/** The page background behind the tile, with the tile's 6% foreground mixed in. */
const THEMES = { dark: "#262523", light: "#eeedea" };
const WIDTHS = [700, 300];

const [out, ...wanted] = process.argv.slice(2);
if (!out) throw new Error("usage: preview.mjs <out-dir> [slug ...]");
const slugs = wanted.length
    ? wanted
    : (await readdir(THUMBS)).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4));

await mkdir(out, { recursive: true });
for (const slug of slugs) {
    const svg = await readFile(join(THUMBS, `${slug}.svg`));
    for (const [theme, background] of Object.entries(THEMES))
        for (const width of WIDTHS) {
            const file = join(out, `${slug}-${theme}-${width}.png`);
            await sharp(svg, { density: (72 * width) / 1200 })
                .resize({ width })
                .flatten({ background })
                .png()
                .toFile(file);
        }
    console.log(slug);
}
