# Content

Projects and posts are MDX files: `content/projects/<slug>.mdx` and `content/blog/<slug>.mdx`. The file name is the
slug (`content/blog/cuda-mmm.mdx` is `/blog/cuda-mmm`). Each file starts with YAML frontmatter, checked at build time
against `src/lib/content-schema.ts`; a missing or misspelt field fails `npm run build` with a message that names the
file. Everything below the frontmatter is the write-up.

`src/lib/content.ts` reads the folders (`getProjects`, `getProject`, `getPosts`, `getPost`), and `src/lib/mdx.tsx`
compiles a body to React on the server. The Markdown elements and the components below live in
`src/app/components/mdx/`.

## Project frontmatter

```yaml
---
title: "Tiny-GEMM: Packed INT4 Triton GEMM for Decode-Heavy LLM Inference"
shortTitle: Tiny-GEMM # tiles, pagers, hover cards; the full title heads the page
description: One or two sentences under the title and on the tile.
longDescription: The paragraph under the description on the page.
date: "2025" # written for people: "2026", "October 2025", "January 21, 2026"
year: 2025
order: 2 # where it sits among the projects; lower first
tags: [Triton, CUDA]
featured: true
hidden: false # true: no page, and left out of every list
thumb: /tiny-gemm/int4_speedup_heatmap_m1.webp # 3:2 preview on the strip
thumbStyle: figure # "cover" (default) crops to fill; "figure" fits a white-background plot and inverts it in dark mode
hero: { type: image, src: /verigen/demo.gif, alt: VeriGen workflow } # or type: video
externalUrl: https://example.com/write-up # the tile links out and no page is built
liveUrl: https://example.com
paperUrl: /tiny-gemm/Tiny-GEMM.pdf
githubUrl: https://github.com/zhan4808/gemmopt
---
```

`title`, `description`, `longDescription`, `date`, `year`, and `order` are required; the rest are optional. The
link under the intro is the paper, then the code, then the live site.

Projects are listed in `order`; the strip groups them by `year`, newest first, and keeps `order` within a year.

## Post frontmatter

```yaml
---
title: july
subtitle: finding excitement in the everyday
date: July 31, 2025
year: 2025
order: 5 # where it sits among the posts; lower first
hidden: false # true: still builds at its URL with noindex, but out of the list, the feed, and the sitemap
coverImage: /oai2.webp
coverGradient: from-orange-300 via-pink-300 to-blue-300 # Tailwind gradient stops
tracks: # what was playing
    - title: where you are
      artist: john summit
      albumArt: /whereyouare.webp
      audioSrc: /whereyouare.mp3 # played inline when present
      spotifyUrl: https://open.spotify.com/track/0bFBRve9nqszP6fC7eX8nY # linked when there is no audio file
---
```

`title`, `subtitle`, `date`, `year`, and `order` are required. The blog index groups posts by `year`, newest year
first, and keeps `order` within a year; previous and next step through visible posts in `order`.

## The body

Markdown, with GitHub tables, `$$` math, and fenced code. Every element is styled: paragraphs, `##` and `###`
headings (which get ids), `-` lists, `1.` lists, links, `>` quotes, tables, code, `---` rules.

A project body is a sequence of sections; a post body is just the blocks.

````mdx
<Section id="results" title="Results">

A paragraph. Links like [FlashInfer](https://github.com/flashinfer-ai/flashinfer) open in a new tab when they leave
the site.

### A smaller heading

- A tight list
- of short items

| Shape   | FP16 (ms) | INT4 (ms) |
| ------- | --------- | --------- |
| KV proj | 0.027     | 0.043     |

$$
T_{\text{total}} = T_{\text{launch}} + T_{\text{mem}}(W)
$$

```cpp
// Highlighted by shiki in both themes.
for (int i = 0; i < n; ++i) acc += a[i] * b[i];
```

```
A fence without a language is a plain panel.
```

</Section>
````

The id is the anchor (`/projects/tiny-gemm#results`), so it is written down rather than derived from the title. The
content inside a component can be indented or not; both parse the same.

Markdown reads `*`, `_`, backticks, `<`, `{`, and `$` as syntax. To show one literally, escape it: `\*`, `\{`, `\$`.

## Components

Each is written by name in the body. `src/app/components/mdx/index.ts` is the full list.

### Figure

An image with an optional caption; clicking opens the lightbox. `src` is a site path under `public/` (run
`npm run media:optimize` first; see [media.md](media.md)). `invert` is for diagrams drawn dark-on-white.

```mdx
<Figure src="/cuda-mmm/split_k.webp" alt="Split-K partitions the K dimension across blocks" caption="Split-K." invert />
```

### Gallery

A grid of figures: two across on phones, three from `md` up.

```mdx
<Gallery>
    <Figure src="/IMG_1493.webp" alt="Horseback riding on the beach" caption="horseback riding on the beach" />
    <Figure src="/IMG_1760.webp" alt="Coastal landscape at sunset" caption="views at sea ranch, ca" />
</Gallery>
```

### Video

```mdx
<Video src="/atalla/flashattention.mp4" caption="FlashAttention tiles streaming through the scratchpad." />
```

### Gradient

A band of colour from Tailwind gradient stops.

```mdx
<Gradient className="from-orange-300 via-pink-300 to-blue-300" />
```

### Quote

A pulled quote, italic in quotation marks, with the person it is from when there is one. A plain `> quote` renders the
same way without an author.

```mdx
<Quote author="Rick Rubin">
    there's a tremendous power in using the least amount of information to get a point across.
</Quote>
```

### LinkCard

A link on its own line, opening in a new tab, with a line under it saying what it is.

```mdx
<LinkCard
    href="/skin-ensemble.pdf"
    label="View the full project PDF"
    description="Full research write-up and results."
/>
```

### Visualization

A titled, captioned panel around a figure. `prompt` is kept with the content and not shown.

```mdx
<Visualization
    title="Roofline"
    prompt="Where does each kernel sit against the A6000's roofline?"
    caption="Every kernel after 4 is compute-bound."
    media={{ type: "image", src: "/cuda-mmm/roofline.webp", alt: "Roofline plot" }}
/>
```

## Formatting

`content/` is left out of Prettier: its MDX support predates MDX 3 and reflows table cells and escapes. The files that
came from the old `src/lib/data.ts` were written by `scripts/migrate-content.mjs`, which indents the inside of each
component by two spaces; new files can do the same or not.
