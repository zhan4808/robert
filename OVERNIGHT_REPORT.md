# Overnight report

Branch: `overnight-review` (worktree at `/Users/robertzhang/Documents/GitHub/robert-overnight`). Nothing was merged and `main` was not touched.

Preview: https://portfolio-56b6ztej4-robertzhang.vercel.app (Vercel build for commit 9e55550 succeeded; dashboard: https://vercel.com/robertzhang/portfolio/613E6P7RQuj5gjtf3CVv3CB7yDqg). If it asks for a login, that is Vercel deployment protection.

prettier, eslint, `tsc --noEmit` and `npm run build` all pass.

## The idea

Most of the night went into making the site more credible rather than bigger. The three retold Simon Boehm posts and the sparse-attention design doc are retired. The NVLink series got expert-level fixes, with no Astera numbers. Two project pages an expert would have caught on first read (MLA, Tiny-GEMM) were rewritten. The design work puts every page in one reading frame. Only two new posts were drafted, both hidden, both built from measurements already on disk.

## Design and code

- **Hidden means gone.** A post or project with `hidden: true` now gets no page in production (404). It still renders under `next dev` with noindex, so drafts can be read locally. Without this change, retiring a post did nothing, because june and happiness were still reachable by URL.
- **One header** for posts and projects: title, italic subtitle, a sans meta line ("Nov 15, 2026 · 8 min · Part 1 of 4"), one hairline. Project `<Section>` headings use the same serif H2 as posts. Projects can take an optional `subtitle`.
- **Index:** the NVLink series is one row (series title, "four parts", four short titles). Dates show the month only. Phones show the kind as a dot only. Labels stay muted and colour is on the dot only, so koi stays the one accent. Project is olive and Life is slate blue, both at least 4.5:1 on paper.
- **Contents on phones** is a link in the meta line. It opens the list, scrolls it into view and focuses the first entry. It shows only on pages with 3 or more headings.
- **Diagrams on phones** scroll sideways at a width where no label falls under 11px. The fade on the right edge ends on empty padding, so the last labels are readable.
- **Figures:** raster figures sit on a tile, multiplied in light mode and dimmed in dark mode. `invert` now applies in dark mode only; before, it also turned dark-on-white diagrams black in light mode. The lightbox shows the full image without those blend modes. Before this fix, every expanded figure rendered almost black in light mode.
- **Astera guard on part 1's traced charts:** gridlines are gone and the traced values are rounded, so the charts keep their shapes and order but carry no readable levels.
- **Small fixes:**
  - the swapped gallery captions (and the same swap in the docs example)
  - the july photo captions, which were on the wrong photos
  - a dead home-intro sentence, which now links the NVLink series and Tiny-GEMM
  - a footer that is one wrapping line of links (it no longer clips at 320px)
  - the archive's v6 description
  - chart labels that overlapped curves in parts 1 and 3
  - the code-block copy button sitting on top of code
  - table columns hidden on desktop
  - a 4px horizontal overflow on photo pages

## Posts and projects

- **Retired (hidden, files kept):** `cuda-mmm`, `cpu-mmm`, `pipeline-parallel` (retellings of other people's work and timings) and `projects/sparse-attention` (a design doc with no results).
- **tp-without-nvlink (part 1):**
  - all-reduce count stated as "about two per layer" instead of an unexplained 91
  - ring as NCCL's default, with the Tree exception linked to part 2
  - a sentence on channels
  - the TP8 claim limited to models that fit in one box
  - scope stated: tensor parallelism only
- **nccl-defaults-off-nvlink (part 2):**
  - removed "half rate", "several times faster" and "over a hundred thousand all-reduces"
  - says the tree is a chain inside each node
  - the mpirun command now forwards `NCCL_*` with `-x`
- **pcie-vs-ethernet-scale-up (part 3):**
  - MLA replication tied to default TP in vLLM/SGLang
  - why TP16 starts behind
  - the async caveat in a Note
  - CPU-tier sentence cut
  - trends-only disclaimer kept in the caption only
- **reading-vllm-runs (part 4):** removed every rig-derived count. The heading is now "What cost us GPU time", because the list holds nine pitfalls and two of them hang the run. The profiler advice is in one place.
- **projects/mla-profiling:**
  - Corrected against the later validation work in `cache-barrier/profiling/validation/` (REPORT.md, diag_results.json, graph_rotation.json).
  - A dated correction note.
  - The cold-cache NCU and launch-floor explanation, plus the 36 MB effective capacity.
  - The rotation table and the W8A8 result.
  - One causal story throughout: dequantization is the main cause and L2 the smaller one.
  - A "what I check now" list, plus the finding that event-timed ratios changed between Triton versions.
  - Dropped figures with wrong captions or the old 50 MB boundary drawn in, and dropped unsupported claims.
- **projects/tiny-gemm:**
  - consistent 4x byte ceiling, and 3.58x instead of "up to 3.7x"
  - the regime section rewritten around launch floor and CTA fill
  - the alpha rule dropped, with the reason
  - correct unpack path (registers, FP16 MMA)
  - a Limitations paragraph
  - 15 figures cut to the 4 that match the table
- **projects/graph-scheduling:**
  - scoring corrected to the contest rules
  - final per-benchmark speedups from `MLSys/NOTES.md`, checked against the output JSONs
  - zig-zag claim reduced to the one measured case
  - recomputation described as considered and rejected (the solver has none)
- **projects/atalla-kernels:**
  - cache and softmax contradictions fixed
  - double buffering stated honestly (the loop as written doesn't overlap)
  - im2col and Horner numbers cut
  - conditional rescaling credited to FlashAttention-4
  - Ax02 marked as planned
- **july, purpose:** cut abstract filler and repeated lines. Only things the posts already said remain.

## New drafts (both `hidden: true`)

- **quantizing-can-make-it-slower:** W8A8 beats cuBLAS FP16 above the roughly 36 MB effective L2 and loses below it. A Qwen3-8B per-layer table shows quantizing all five projections is slower than bf16. Two further sections: fused activation quant, and calibrating the per-layer choice on the serving GPU.
  - Evidence:
    - `cache-barrier/profiling/w8a8/REPORT.md` and `results_w8a8.json`
    - `regime-router/RESULTS.md`, `FINDINGS.md` and `runs/summary/gemm_sweep.csv`
    - `cache-barrier/profiling/cuda_validation/REPORT.md`
  - It links to the MLA page for the sweep table rather than copying it, and its paper-style PNG was removed.
- **check-the-baseline-first:** five wrong answers from one fused-MoE quantization study, each caused by a baseline or a harness, and a pre-flight list.
  - Evidence:
    - `cache-barrier/profiling/fused_moe/REPORT.md`, `results_fused_moe_extended.json` and `PR_BODY.md`
    - `cache-barrier/profiling/cuda_validation/REPORT.md` and `results_verification.json`
- **Cut:** a third draft, the-profiler-flushed-my-cache. Once the MLA page carried the full correction, the draft told the same story twice. Its checklist and version-drift paragraph moved into the MLA page.

## Deliberately not done

- A justified photo grid, keyboard hints, a webring, sidenotes, a bio toggle, and re-shot archive screenshots: nice details, but none of them fixes anything broken.
- A "decode traffic from the config" post: it duplicates the series and is mostly Astera-restricted.
- A systolic loop-order post: it rests on unmerged team branches and needs teammate sign-off.
- Any edits to the already-hidden journal or hackathon posts, and an OmNom line.
- Redrawing matplotlib figures as themed `<Diagram>`s. The graph-scheduling, MLA and Tiny-GEMM PNGs still show as bright panels in dark mode.
- No measurement, date or result was invented. Where a fact wasn't on disk, the claim was cut.

## Open questions for you

1. **Drafts:** read both drafts and spot-check their numbers against the evidence files before unhiding. quantizing-can-make-it-slower links to check-the-baseline-first, so publish them together or drop that link.
2. **MLA correction note:** confirm you're comfortable with a public correction on MLA. Also check that `public/mla-profiling/paper.pdf` matches the corrected `cache-barrier/paper/main.tex`.
3. **Tiny-GEMM inconsistencies:**
   - FP16 DRAM bandwidth is 75 to 77% in the paper but 92.3% on the NCU chart.
   - The M=16 curve exceeds the 4x ceiling.
   - Some values are arithmetic derived from the page's own numbers, not measurements: "about 90%", the weight MB values and "about 80%".
4. **july:** the subtitle "finding excitement in the everyday" no longer matches the body. Retitle?
5. **Part 3:** the LayoutMap row for long-context MLA shows PP2 × TP8 winning at all three loads, but the text only claims the agentic trace. Should that row be one merged cell?
6. **Part 1:** a small channel diagram would help next to the new channel sentence.
7. **AGENTS.md:** it is boilerplate generated by `next dev` and is left uncommitted. Delete it or keep it.

## How to merge

Review the preview, then:

```
cd /Users/robertzhang/Documents/GitHub/robert
git fetch origin
git checkout main && git merge overnight-review
git push origin main
```

To take only part of it, cherry-pick commits from `git log main..overnight-review --oneline`. For example, the design commits are 12f59ab, 4c6cb12, c9c0566, 92cc087, 2f4974e and eb7811f. The content commit is d61b091, the drafts commit is 7311f1e, the UI fixes are 2435e72, and the review close-out is 9e55550. Run `git cherry-pick <sha>` for each one you want. 12f59ab (hidden posts get no page) should come along with any content commit that hides posts.

## Fact-check fixes

Commit 5bf516e applies a fact-check pass over every changed content file, checked against main and the evidence repos (cache-barrier, regime-router, MLSys, tiny-gemm).

- **Tiny-GEMM is now hidden, and its results are invalid.** In `tiny-gemm/triton_gemm.py` the grid is `grid_m*grid_n // GROUP_SIZE_M`, and the pid mapping then skips most programs. At M=1 the kernel computes 1/16 of the output for Q/O and FFN down and 1/4 for FFN up. Every CSV shows `max_abs_diff` of about 4e7. The kernel is also W4A4, not weight-only. A comment at the top of the page records this. The home intro now links MLA profiling instead.
- **L2 caveat.** MLA profiling and the quantizing draft now say their L2-resident results come from warm single-operator loops, and that a full decode step streams the weights from HBM.
- **Number fixes.** Intensity reaches 93 at bs=1024, not 128. The FP16 slowdown when forced to HBM is explained by reloading the roughly 12 MB that L2 had been serving. The MLA cache entry is 576 values. The unsupported "1e-3" accuracy comparison is cut. The quantizing draft now uses MiB throughout.
- **Series wording.** Part 3's per-call claim is back to main's wording ("as NCCL sees it", about the hop). The PP2×TP8 sentence is cut. Smaller wording fixes in parts 1 to 3.
- **Charts.** The breakdown shares are coarsened to steps of 0.1, which also removes the thin residual sliver inside one box. The message-size charts now say small / decode range / large instead of showing byte ticks, and the byte tick positions are gone from `traced.json`.
- **Still to do.** Re-run tiny-gemm with a fixed grid before un-hiding it. Check whether its `tl.dot` compiles to TF32.
