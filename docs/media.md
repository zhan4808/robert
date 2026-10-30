# Media

Everything a page serves lives under `public/`. Images go through one script before they are committed, so the
repository stays small and every raster file arrives sized, in WebP, with a blur placeholder.

## Adding an image

1. Drop the original anywhere under `public/` (a per-post folder like `public/cuda-mmm/` keeps things findable). Any
   format is fine: a phone JPEG, a matplotlib PNG, a Figma export.
2. Run `npm run media:optimize` (or `just media`).
3. Reference the output path from the content file (`<Figure src="/cuda-mmm/split_k.webp" />`), not the original
   name. If you had already written the original name, the script rewrites it for you.

Commit the optimized file, the manifest (`src/lib/image-meta.json`), and any rewritten references together.

## What the script does

`scripts/optimize-media.mjs` walks `public/` and is idempotent: a second run reports nothing to do.

| Input                              | Output                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `.jpg` / `.jpeg`                   | lossy WebP, quality 82, capped at 2400px on the long edge                  |
| `.png` photograph (high entropy)   | lossy WebP, quality 82, capped at 2400px                                   |
| `.png` plot or diagram             | **lossless** WebP: pixel-identical, so axis text stays sharp, ~45% smaller |
| `.webp`                            | left alone unless it is over the cap                                       |
| `.svg` `.pdf` `.gif` `.mp3` `.mp4` | never touched                                                              |

The cap (2400px covers a 1200px frame on a 2x display) always applies to photos. A figure over the cap is only
downscaled when that makes the file smaller: resampling touches every pixel of a lossless image and can double its
size, and the Next optimizer resizes on the way out anyway. A source that WebP cannot make smaller is kept as it is.
EXIF rotation is baked in and metadata is stripped. Originals are deleted once the WebP is written, and every
`"/old.jpg"` string and `public/old.jpg` static import under `src/` and `content/` is rewritten to the new name.

Audio is deliberately left as it is: the MP3s are already lossy and re-encoding would only degrade them. The
`<audio>` elements use `preload="none"`, so nothing downloads until someone presses play.

Flags: `--dry` reports what would change without writing; `--manifest` only regenerates the manifest.

## The manifest

`src/lib/image-meta.json` maps each raster path to `{ width, height, blurDataURL }` (the placeholder is a 10px
WebP as a data URL, about 150 bytes). `imageMeta(src)` in `src/lib/images.ts` reads it; pages pass the result into
`next/image` as `width`, `height`, `placeholder="blur"` and `blurDataURL`, so the layout is reserved before the
image loads and the optimizer serves a resized AVIF/WebP for the viewer's screen instead of the full file.

An image without a manifest entry (an SVG, or a file added without running the script) still renders, as a plain
`<img>` or with fallback dimensions, so a missed run is a performance regression rather than a broken page. The
manifest is looked up in server components only, so it never enters a client bundle.

## Project thumbnails

The 3:2 covers on the projects strip (`public/thumbs/<slug>.svg`) are drawn by `scripts/thumbs/thumbs.mjs`, one
function per project from a shared kit (grey cells on a pixel grid, the koi orange as the accent, a cool blue for
the odd pointer, no background). Edit the function and run `npm run thumbs` to regenerate; `node
scripts/thumbs/preview.mjs <dir>` renders each one over the dark and light tiles at strip and hover-card size so
a change can be checked by eye. The SVGs are served as they are, so they have no manifest entry.

## Where images render

- Write-up content (`image`, `gallery`, `visualization` blocks): `src/app/components/content-blocks.tsx` and the
  thumbnail in `src/app/components/image-lightbox.tsx`. The lightbox's zoomed view loads the full optimized file,
  but only when the reader opens it.
- Post cover and album art: `src/app/blog/[slug]/page.tsx`.
- Project hero: `src/app/projects/[slug]/page.tsx` looks the meta up and hands it to `project-page.tsx`.
- Gallery: `src/app/gallery/page.tsx` imports its photos statically, which gives Next the size and blur on its own.
