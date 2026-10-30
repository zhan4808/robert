#!/usr/bin/env node
/**
 * Media pipeline for everything under public/. Idempotent: a second run changes nothing. See docs/media.md.
 *
 *   npm run media:optimize                 optimize, rewrite references under src/ and content/, write the manifest
 *   npm run media:optimize -- --dry        report what would change without touching anything
 *   npm run media:optimize -- --manifest   only regenerate src/lib/image-meta.json
 *
 * Raster images (jpg, jpeg, png, webp) become WebP with EXIF rotation baked in and metadata stripped, and each
 * "/old.ext" reference under src/ and content/ is rewritten to the new name:
 *   - jpg/jpeg, and png photographs (continuous-tone, judged by entropy), become lossy WebP at WEBP_QUALITY, capped
 *     at MAX_EDGE on the long edge.
 *   - png plots and diagrams become *lossless* WebP: pixel-identical, so axis text and hairlines stay sharp, and
 *     40–50% smaller than an optimized PNG. (Lossy WebP would soften the text and is often larger anyway.) One over
 *     the cap is only downscaled when that makes it smaller; resampling a lossless figure often doesn't.
 *   - a source that WebP can't make smaller is kept as it is.
 *   - webp files already in place are left alone unless they are over the cap.
 * svg, pdf, gif, mp3, mp4 and everything else are never touched: the audio is already lossy, gifs would need a
 * video pipeline, and the vectors and papers are served as they are.
 *
 * The manifest maps every raster path ("/dir/file.webp", gifs included) to { width, height, blurDataURL } so pages
 * can size <Image> correctly and show a blurred placeholder while the real file loads.
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const SRC = join(ROOT, "src");
const CONTENT = join(ROOT, "content");
const MANIFEST = join(SRC, "lib", "image-meta.json");

/** Longest edge, in pixels, of anything served. 2400 covers a 1200px frame on a 2x display. */
const MAX_EDGE = 2400;
const WEBP_QUALITY = 82;
/** Long edge of the blur placeholder, in pixels; ~150 bytes of base64 per image. */
const BLUR_EDGE = 10;
/**
 * Greyscale entropy (bits) above which an image is treated as a photograph. Plots and diagrams are mostly flat
 * paper and score up to 4.9 on this site; photographs score 5.3 and up (flat album art lower, but that's JPEG).
 */
const PHOTO_ENTROPY = 5;

const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp"]);
/** In the manifest (they render through <Image>) but never re-encoded. */
const MANIFEST_ONLY = new Set([".gif"]);

const args = new Set(process.argv.slice(2));
const dry = args.has("--dry") || args.has("--dry-run");
const manifestOnly = args.has("--manifest");

const kb = (n) => `${Math.round(n / 1024)}K`;
/** "/dir/file.webp": the path a page uses, from a file under public/. */
const sitePath = (file) => "/" + posix.join(...relative(PUBLIC, file).split(/[\\/]/));

async function walk(dir, out = []) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) continue;
        const p = join(dir, entry.name);
        if (entry.isDirectory()) await walk(p, out);
        else out.push(p);
    }
    return out;
}

/** Width and height as displayed, once EXIF orientation is applied. */
async function dimensions(file) {
    const { width, height, orientation = 1 } = await sharp(file, { animated: false }).metadata();
    return orientation >= 5 ? { width: height, height: width } : { width, height };
}

const isPhoto = async (file) => (await sharp(file).stats()).entropy >= PHOTO_ENTROPY;

/** Orientation baked in and metadata dropped; with `cap`, the long edge is brought down to MAX_EDGE. */
const prepare = (file, cap) => {
    const image = sharp(file).rotate();
    return cap ? image.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true }) : image;
};

const toWebp = (image, lossless) =>
    image.webp(lossless ? { lossless: true, effort: 6 } : { quality: WEBP_QUALITY, effort: 6 }).toBuffer();

/**
 * The best encoding of one file: its new path, bytes and why, or null to leave the file alone.
 *
 * Photos are always capped. A figure is encoded losslessly, so resampling it adds a little noise to every pixel and
 * can make the file *bigger* (a 2406px diagram brought to 2400px doubled); it is only downscaled when that wins.
 */
async function optimize(file) {
    const ext = extname(file).toLowerCase();
    const { width, height } = await dimensions(file);
    const oversized = Math.max(width, height) > MAX_EDGE;
    const capped = oversized ? `, ${width}x${height} capped` : "";

    if (ext === ".webp" && !oversized) return null;
    const out = file.slice(0, -ext.length) + ".webp";

    if (ext === ".jpg" || ext === ".jpeg" || (await isPhoto(file))) {
        return { out, buffer: await toWebp(prepare(file, true), false), reason: `photo, lossy${capped}` };
    }

    const full = await toWebp(prepare(file, false), true);
    if (!oversized) return { out, buffer: full, reason: "figure, lossless" };
    const small = await toWebp(prepare(file, true), true);
    return small.length < full.length
        ? { out, buffer: small, reason: `figure, lossless${capped}` }
        : { out, buffer: full, reason: `figure, lossless, kept at ${width}x${height} (capping would grow it)` };
}

/**
 * Rewrites every reference to a renamed file under src/ and content/: "/a.jpg" strings, ../public/a.jpg static
 * imports, and unquoted frontmatter values (`thumb: /a.jpg`).
 */
async function rewriteReferences(renames) {
    if (renames.length === 0) return [];
    const files = [...(await walk(SRC)), ...(await walk(CONTENT))].filter((f) => /\.(tsx?|jsx?|mjs|css|mdx?)$/.test(f));
    const touched = [];
    for (const file of files) {
        const before = await readFile(file, "utf8");
        let after = before;
        for (const { from, to } of renames) {
            // Both spellings end in the site path, so one replacement covers content files and static imports.
            after = after.split(`${from}"`).join(`${to}"`).split(`${from}'`).join(`${to}'`);
            after = after.split(`${from}\n`).join(`${to}\n`);
        }
        if (after !== before) {
            touched.push(relative(ROOT, file));
            if (!dry) await writeFile(file, after);
        }
    }
    return touched;
}

async function buildManifest(files) {
    const manifest = {};
    for (const file of files.sort()) {
        const ext = extname(file).toLowerCase();
        if (!RASTER.has(ext) && !MANIFEST_ONLY.has(ext)) continue;
        const blur = await sharp(file, { animated: false })
            .rotate()
            .resize({ width: BLUR_EDGE, height: BLUR_EDGE, fit: "inside" })
            .webp({ quality: 60, alphaQuality: 60 })
            .toBuffer();
        manifest[sitePath(file)] = {
            ...(await dimensions(file)),
            blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
        };
    }
    return manifest;
}

async function main() {
    if (!manifestOnly) {
        const renames = [];
        let before = 0;
        let after = 0;
        for (const file of await walk(PUBLIC)) {
            if (!RASTER.has(extname(file).toLowerCase())) continue;
            const job = await optimize(file);
            if (!job) continue;

            const inputSize = (await stat(file)).size;
            const { out, buffer, reason } = job;
            // A lossless source that WebP can't beat stays as it is.
            if (buffer.length >= inputSize) {
                console.log(`keep ${relative(ROOT, file)}: ${kb(inputSize)} (WebP would be ${kb(buffer.length)})`);
                continue;
            }
            const rel = relative(ROOT, file);
            console.log(
                `${dry ? "would write" : "write"} ${relative(ROOT, out)} (was ${rel}): ${kb(inputSize)} -> ${kb(buffer.length)} [${reason}]`
            );
            before += inputSize;
            after += buffer.length;
            if (!dry) {
                await writeFile(out, buffer);
                await rm(file);
            }
            renames.push({ from: sitePath(file), to: sitePath(out) });
        }

        const touched = await rewriteReferences(renames);
        for (const f of touched) console.log(`${dry ? "would rewrite" : "rewrote"} references in ${f}`);
        if (before > 0) console.log(`${dry ? "would take" : "took"} ${kb(before)} to ${kb(after)}`);
        else console.log("nothing to optimize");
    }

    if (dry) return;

    const manifest = await buildManifest(await walk(PUBLIC));
    const json = JSON.stringify(manifest, null, 4) + "\n";
    const current = await readFile(MANIFEST, "utf8").catch(() => "");
    if (current === json) {
        console.log(`${relative(ROOT, MANIFEST)} is up to date (${Object.keys(manifest).length} images)`);
    } else {
        await mkdir(dirname(MANIFEST), { recursive: true });
        await writeFile(MANIFEST, json);
        console.log(`wrote ${relative(ROOT, MANIFEST)} (${Object.keys(manifest).length} images)`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
