#!/usr/bin/env node
/**
 * Cover art for the projects strip: one 3:2 SVG per project, drawn from the same small kit so they read as a set.
 *
 *   node scripts/thumbs/thumbs.mjs            write public/thumbs/<slug>.svg for every project below
 *   node scripts/thumbs/thumbs.mjs mla-profiling tiny-gemm   only those
 *
 * The kit, shared with the koi pond: square cells on a pixel grid with small gaps and 2px corners, hairline
 * strokes, and only right angles and 45° bends. One neutral grey carries all the structure at a few opacities, the
 * koi orange is the one warm accent, and a cool blue marks the odd thing worth pointing at. The background is left
 * transparent, so every piece has to hold up on the light tile and the dark one.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "thumbs");

/** Frame size and the margin nothing crosses. */
export const W = 1200;
export const H = 800;
const M = 80;

const GREY = "#8a8884";
const ORANGE = "#e0702b";
const BLUE = "#6f8fae";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

// ── drawing kit ───────────────────────────────────────────────────────────────────────────────────────────────────

/** Numbers as short as they can be: "24", "24.5". */
const n = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1).replace(/\.0$/, ""));

const opacity = (attr, value) => (value >= 1 ? "" : ` ${attr}="${n(value)}"`);

/** A filled, rounded rectangle: the cells everything is built from, and the odd bar. */
const box = (x, y, w, h, color = GREY, alpha = 0.5, rx = 2) =>
    `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" fill="${color}"${opacity("fill-opacity", alpha)}/>`;

/** A cell: a square `box`, kept as data so `svg` can group neighbours that share a fill. */
const cell = (x, y, size, color = GREY, alpha = 0.5) => ({ x, y, size, color, alpha: Math.round(alpha * 50) / 50 });

/** A stroked rectangle with no fill, for boundaries and groups. */
const frame = (x, y, w, h, color = GREY, alpha = 0.5, { width = 2, dash, rx = 4 } = {}) =>
    `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" fill="none" stroke="${color}"` +
    `${opacity("stroke-opacity", alpha)} stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

/** A stroked path. `d` is SVG path data; points come from `poly`. */
const stroke = (d, color = GREY, alpha = 0.5, { width = 2, dash, cap = "round" } = {}) =>
    `<path d="${d}" fill="none" stroke="${color}"${opacity("stroke-opacity", alpha)} stroke-width="${width}"` +
    ` stroke-linecap="${cap}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;

/** Path data through the points. */
const poly = (points) => points.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join(" ");

/**
 * An axis-aligned polyline with every corner cut at 45°: `r` is how far before and after each corner the cut
 * starts. The kit's way of turning without a curve.
 */
function chamfered(points, r = 12) {
    const out = [points[0]];
    for (let i = 1; i < points.length - 1; i++) {
        const [px, py] = points[i - 1];
        const [x, y] = points[i];
        const [qx, qy] = points[i + 1];
        const a = [Math.sign(x - px), Math.sign(y - py)];
        const b = [Math.sign(qx - x), Math.sign(qy - y)];
        out.push([x - a[0] * r, y - a[1] * r], [x + b[0] * r, y + b[1] * r]);
    }
    out.push(points[points.length - 1]);
    return poly(out);
}

/** A chevron arrowhead whose tip is at (x, y), pointing `dir`: two 45° strokes. */
function arrow(x, y, dir, color = GREY, alpha = 0.5, size = 10) {
    const [dx, dy] = { right: [-1, 0], left: [1, 0], down: [0, -1], up: [0, 1] }[dir];
    const [nx, ny] = [-dy, dx];
    const d = poly([
        [x + (dx + nx) * size, y + (dy + ny) * size],
        [x, y],
        [x + (dx - nx) * size, y + (dy - ny) * size],
    ]);
    return stroke(d, color, alpha);
}

/** A small monospace label; the only text the set allows, and only where the label is the idea. */
const label = (x, y, text, { size = 26, color = GREY, alpha = 0.7, anchor = "start" } = {}) =>
    `<text x="${n(x)}" y="${n(y)}" font-family="${MONO}" font-size="${size}" fill="${color}"` +
    `${opacity("fill-opacity", alpha)} text-anchor="${anchor}">${text}</text>`;

/**
 * The document. Runs of cells are emitted as one <g> per fill (in first-seen order, so what is drawn later still
 * lands on top), which keeps a grid of a few hundred cells well under the size budget.
 */
function svg(parts) {
    const out = [];
    let run = [];
    const flush = () => {
        const groups = new Map();
        for (const c of run) {
            const key = `${c.color} ${c.alpha} ${c.size}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(c);
        }
        for (const [, cells] of groups) {
            const { color, alpha, size } = cells[0];
            out.push(
                `<g fill="${color}"${opacity("fill-opacity", alpha)}>` +
                    cells
                        .map((c) => `<rect x="${n(c.x)}" y="${n(c.y)}" width="${n(size)}" height="${n(size)}" rx="2"/>`)
                        .join("") +
                    "</g>"
            );
        }
        run = [];
    };
    for (const part of parts.flat(Infinity)) {
        if (!part) continue;
        if (typeof part === "string") {
            flush();
            out.push(part);
        } else run.push(part);
    }
    flush();
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n` +
        out.join("\n") +
        "\n</svg>\n"
    );
}

/** A small deterministic generator, so the texture in the weight blocks is the same on every run. */
function rng(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const lerp = (a, b, t) => a + (b - a) * t;

// ── the seven ─────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * MLA profiling. A thin 512-wide latent (orange) is reconstructed, every layer, into full-width K and V by batched
 * GEMMs against two wide weight blocks. The blocks sit inside a dashed boundary marked L2: the 50 MB cache they fit
 * in, which is why INT4 can't make them faster.
 */
function mlaProfiling() {
    const p = 24;
    const c = 20;
    const parts = [];
    const rand = rng(7);

    // The latent: two cells wide, most of the height.
    const latRows = 17;
    const latX = M;
    const latY = (H - (latRows * p - (p - c))) / 2;
    for (let r = 0; r < latRows; r++)
        for (let i = 0; i < 2; i++) parts.push(cell(latX + i * p, latY + r * p, c, ORANGE, 1));

    // K and V weight blocks: wide, textured like data.
    const bx = 420;
    const bCols = 27;
    const bRows = 8;
    const bh = bRows * p - (p - c);
    const kY = 150;
    const vY = H - kY - bh;
    for (const y0 of [kY, vY])
        for (let r = 0; r < bRows; r++)
            for (let j = 0; j < bCols; j++) parts.push(cell(bx + j * p, y0 + r * p, c, GREY, lerp(0.22, 0.6, rand())));

    // The L2 boundary around both, labelled at its corner.
    const pad = 36;
    const bw = bCols * p - (p - c);
    parts.push(frame(bx - pad, kY - pad, bw + 2 * pad, vY + bh - kY + 2 * pad, BLUE, 0.85, { dash: "10 10" }));
    parts.push(label(bx + bw + pad, kY - pad - 18, "L2", { color: BLUE, alpha: 0.95, anchor: "end" }));

    // Reconstruction: four rows of the latent fan out to each block, bending once at 45°.
    const fan = (latentRows, blockY, blockRows) => {
        latentRows.forEach((lr, i) => {
            const ys = latY + lr * p + c / 2;
            const yt = blockY + blockRows[i] * p + c / 2;
            const x0 = latX + 2 * p - (p - c) + 8;
            parts.push(
                stroke(
                    poly([
                        [x0, ys],
                        [x0 + Math.abs(yt - ys), yt],
                        [bx - 8, yt],
                    ]),
                    ORANGE,
                    0.6
                )
            );
        });
    };
    fan([4, 5, 6, 7], kY, [0, 2, 4, 6]);
    fan([12, 11, 10, 9], vY, [7, 5, 3, 1]);

    return svg(parts);
}

/**
 * Tiny-GEMM. One weight tile, packed on the left and unpacked on the right: two 4-bit nibbles share each byte-sized
 * slot until a 45° frontier, past which every value has its own full cell. The row being decoded is orange, and the
 * FP32 accumulator it lands in is the blue column at the edge.
 */
function tinyGemm() {
    const p = 32;
    const c = 28;
    const cols = 32;
    const rows = 20;
    const x0 = (W - (cols * p - (p - c))) / 2;
    const y0 = (H - (rows * p - (p - c))) / 2;
    const active = 10;
    const parts = [];
    const rand = rng(3);

    for (let r = 0; r < rows; r++) {
        const frontier = 7 + r;
        for (let j = 0; j < cols; j++) {
            const x = x0 + j * p;
            const y = y0 + r * p;
            const hot = r === active;
            if (j === cols - 1) {
                parts.push(cell(x, y, c, BLUE, hot ? 1 : 0.55));
            } else if (j < frontier) {
                // Packed: two nibbles in the slot, the high one a little stronger.
                const nib = (c - 4) / 2;
                const yy = y + (c - nib) / 2;
                parts.push(cell(x, yy, nib, hot ? ORANGE : GREY, hot ? 1 : 0.58));
                parts.push(cell(x + nib + 4, yy, nib, hot ? ORANGE : GREY, hot ? 0.75 : 0.3));
            } else {
                parts.push(cell(x, y, c, hot ? ORANGE : GREY, hot ? 0.9 : lerp(0.22, 0.5, rand())));
            }
        }
    }
    return svg(parts);
}

/**
 * Atalla kernels. A weight-stationary systolic array: each PE holds a weight (the small square inside it),
 * activations stream in from the left and weights load from the top, each row and column one step behind the last,
 * and partial sums drain out of the bottom.
 */
function atallaKernels() {
    const parts = [];
    const pe = 48;
    const pp = 56;
    const cols = 11;
    const rows = 7;
    const gx = 484;
    const gy = 240;
    const s = 20;
    const sp = 24;

    // The array.
    for (let r = 0; r < rows; r++)
        for (let j = 0; j < cols; j++) {
            const x = gx + j * pp;
            const y = gy + r * pp;
            parts.push(box(x, y, pe, pe, GREY, 0.2, 3));
            parts.push(cell(x + (pe - s) / 2, y + (pe - s) / 2, s, GREY, 0.6));
        }

    // Activations from the left, skewed one cell per row.
    for (let r = 0; r < rows; r++) {
        const y = gy + r * pp + (pe - s) / 2;
        const count = 11 - r;
        for (let i = 0; i < count; i++) parts.push(cell(gx - 36 - (i + 1) * sp + 4, y, s, ORANGE, 1 - i * 0.05));
    }

    // Weights from the top, skewed one cell per column.
    for (let j = 0; j < cols; j++) {
        const x = gx + j * pp + (pe - s) / 2;
        const count = 5 - Math.floor(j / 2);
        for (let i = 0; i < count; i++) parts.push(cell(x, gy - 36 - (i + 1) * sp + 4, s, GREY, 0.7 - i * 0.08));
    }

    // Partial sums draining down out of each column.
    for (let j = 0; j < cols; j++) {
        const x = gx + j * pp + pe / 2;
        const y1 = gy + rows * pp - (pp - pe);
        parts.push(
            stroke(
                poly([
                    [x, y1 + 6],
                    [x, y1 + 46],
                ]),
                BLUE,
                0.6
            )
        );
        parts.push(cell(x - s / 2, y1 + 54, s, BLUE, 0.85));
    }
    return svg(parts);
}

/**
 * RISC-V CPU. Five stages side by side with a pipeline register between each pair, five instructions in flight one
 * stage apart (where each has been fades behind it), and the EX/MEM forwarding path looping back over EX.
 */
function riscvCpu() {
    const parts = [];
    const stages = ["IF", "ID", "EX", "MEM", "WB"];
    const sw = 176;
    const gap = 40;
    const top = 150;
    const bottom = 640;
    const c = 20;
    const p = 24;
    const left = (i) => M + i * (sw + gap);

    stages.forEach((name, i) => {
        const x = left(i);
        parts.push(frame(x, top, sw, bottom - top, GREY, 0.4));
        parts.push(label(x + sw / 2, 690, name, { anchor: "middle", alpha: 0.75 }));
        // The pipeline register after this stage.
        if (i < 4) parts.push(box(x + sw + gap / 2 - 6, top, 12, bottom - top, GREY, 0.5, 3));
    });

    // Instructions: a 4-cell word each, the newest at the bottom in IF, the oldest at the top in WB.
    const word = (stage, y, color, alpha) => {
        const x = left(stage) + (sw - (4 * p - (p - c))) / 2;
        for (let k = 0; k < 4; k++) parts.push(cell(x + k * p, y, c, color, alpha));
    };
    for (let i = 0; i < 5; i++) {
        const y = 212 + i * 80;
        const at = 4 - i;
        for (let s = 0; s < at; s++) word(s, y, GREY, 0.2 + 0.08 * s);
        word(at, y, ORANGE, 1);
    }

    // Forwarding: the EX/MEM register's output back round, over the top, into the EX stage's inputs.
    const exL = left(2);
    const reg = exL + sw + gap / 2;
    const y = 212 + 2 * 80 + c / 2;
    const wordL = exL + (sw - (4 * p - (p - c))) / 2;
    const d = chamfered(
        [
            [reg + 6, y],
            [reg + 44, y],
            [reg + 44, top - 48],
            [exL + 16, top - 48],
            [exL + 16, y],
            [wordL - 14, y],
        ],
        12
    );
    parts.push(stroke(d, BLUE, 0.9));
    parts.push(arrow(wordL - 8, y, "right", BLUE, 0.9, 8));

    return svg(parts);
}

/**
 * Graph scheduling. A small computation DAG with its fused subgraph boxed, the op being scheduled in orange, its
 * tiles swept in zig-zag order on the right, and a gauge of fast memory filling towards capacity at the edge.
 */
function graphScheduling() {
    const parts = [];
    const nd = 52;
    const nodes = {
        a: [200, 112],
        b: [380, 112],
        c: [290, 262],
        d: [200, 412],
        e: [380, 412],
        f: [290, 562],
        g: [290, 700],
    };
    const edges = [
        ["a", "c"],
        ["b", "c"],
        ["c", "d"],
        ["c", "e"],
        ["d", "f"],
        ["e", "f"],
        ["f", "g"],
    ];
    const at = (k) => [nodes[k][0], nodes[k][1]];

    // Edges first so the nodes sit on top: straight down, or down then 45° then down.
    for (const [u, v] of edges) {
        const [ux, uy] = at(u);
        const [vx, vy] = at(v);
        const y0 = uy + nd / 2 + 6;
        const y1 = vy - nd / 2 - 6;
        const pts =
            ux === vx
                ? [
                      [ux, y0],
                      [vx, y1],
                  ]
                : [
                      [ux, y0],
                      [ux, (y0 + y1) / 2 - Math.abs(vx - ux) / 2],
                      [vx, (y0 + y1) / 2 + Math.abs(vx - ux) / 2],
                      [vx, y1],
                  ];
        parts.push(stroke(poly(pts), GREY, 0.55));
        parts.push(arrow(vx, y1 + 2, "down", GREY, 0.55, 7));
    }
    // The fused subgraph.
    parts.push(frame(150, 212, 280, 254, GREY, 0.5, { dash: "10 8", rx: 6 }));
    for (const [k, [x, y]] of Object.entries(nodes)) {
        const hot = k === "c";
        parts.push(box(x - nd / 2, y - nd / 2, nd, nd, hot ? ORANGE : GREY, hot ? 1 : 0.3, 4));
    }

    // The scheduled op's tiles, swept in zig-zag so each row reuses the operand the last one loaded.
    const tp = 44;
    const tc = 40;
    const tcols = 9;
    const trows = 7;
    const tx = 600;
    const ty = (H - (trows * tp - (tp - tc))) / 2;
    const swept = 3 * tcols + 5;
    const path = [];
    for (let r = 0; r < trows; r++)
        for (let j = 0; j < tcols; j++) {
            const col = r % 2 ? tcols - 1 - j : j;
            const i = r * tcols + j;
            const x = tx + col * tp;
            const y = ty + r * tp;
            parts.push(cell(x, y, tc, i === swept ? ORANGE : GREY, i === swept ? 1 : i < swept ? 0.5 : 0.16));
            if (i <= swept) path.push([x + tc / 2, y + tc / 2]);
        }
    // Only the turns matter for the route: thin the straight runs out, then draw it with 45° corners.
    const turns = path.filter(
        ([, y], i) => i === 0 || i === path.length - 1 || path[i - 1][1] !== y || path[i + 1][1] !== y
    );
    parts.push(stroke(chamfered(turns, 10), ORANGE, 0.95, { width: 3 }));
    // From the op to its tiles.
    const [cx, cy] = at("c");
    parts.push(
        stroke(
            chamfered(
                [
                    [cx + nd / 2 + 6, cy],
                    [tx - 40, cy],
                    [tx - 40, ty + tc / 2],
                    [tx - 8, ty + tc / 2],
                ],
                12
            ),
            GREY,
            0.45,
            { dash: "6 8" }
        )
    );

    // Fast memory: a gauge of cells filling up to the capacity line.
    const gw = 44;
    const gp = 36;
    const gcount = 17;
    const gx = W - M - gw;
    const gy0 = (H - (gcount * gp - (gp - 32))) / 2;
    const used = 12;
    for (let i = 0; i < gcount; i++) {
        const y = gy0 + (gcount - 1 - i) * gp;
        parts.push(box(gx, y, gw, 32, i < used ? BLUE : GREY, i < used ? 0.7 : 0.18, 2));
    }
    parts.push(
        stroke(
            poly([
                [gx - 14, gy0 - 10],
                [gx + gw + 14, gy0 - 10],
            ]),
            GREY,
            0.7
        )
    );

    return svg(parts);
}

/**
 * Sparse attention. A chunk of queries (rows) against every key so far (columns): each query keeps a sliding window
 * of the last few keys, its own token in blue on the diagonal, and a handful of top-k blocks picked from the rest in
 * orange; everything else is skipped, and the future isn't drawn at all.
 */
function sparseAttention() {
    const parts = [];
    const p = 26;
    const c = 22;
    const cols = 40;
    const rows = 20;
    const x0 = (W - (cols * p - (p - c))) / 2;
    const y0 = (H - (rows * p - (p - c))) / 2;
    const window = 3;
    const rand = rng(11);

    // Top-k picks: blocks of two keys that a query keeps for a few rows before swapping one out, plus the sink at
    // key 0 that every query attends to.
    let blocks = [4, 10];
    for (let r = 0; r < rows; r++) {
        const self = cols - rows + r;
        const limit = self - window - 2;
        blocks = blocks.filter((k) => rand() < 0.62 && k + 1 < limit);
        // A few tries to top the row back up to three; a crowded short row may end up with fewer.
        for (let tries = 0; blocks.length < 3 && tries < 40; tries++) {
            const k = 1 + Math.floor(rand() * (limit - 1));
            if (blocks.every((b) => Math.abs(b - k) > 2)) blocks.push(k);
        }
        const picked = new Set([0, ...blocks.flatMap((k) => [k, k + 1])]);
        for (let j = 0; j <= self; j++) {
            const x = x0 + j * p;
            const y = y0 + r * p;
            if (j === self) parts.push(cell(x, y, c, BLUE, 0.95));
            else if (j > self - window - 1) parts.push(cell(x, y, c, GREY, 0.72));
            else if (picked.has(j)) parts.push(cell(x, y, c, ORANGE, 1));
            else parts.push(cell(x, y, c, GREY, 0.16));
        }
    }
    return svg(parts);
}

/**
 * VeriGen. A simulation trace: a clock, a reset, a valid strobe and a bus with its 45° value crossings, a cursor
 * on the cycle under inspection, and the agent's annotation bracketing the cycles it is reading.
 */
function verigen() {
    const parts = [];
    const names = ["clk", "rst", "valid", "data", "ready"];
    const tx0 = 220;
    const tx1 = W - M;
    const cyc = 60;
    const cycles = (tx1 - tx0) / cyc;
    const rowY = (i) => 160 + i * 116;
    const hh = 30;
    const rand = rng(5);

    names.forEach((name, i) => parts.push(label(M, rowY(i) + 9, name, { alpha: 0.6 })));

    // Hairline rows under each signal.
    for (let i = 0; i < names.length; i++)
        parts.push(
            stroke(
                poly([
                    [tx0, rowY(i) + hh + 14],
                    [tx1, rowY(i) + hh + 14],
                ]),
                GREY,
                0.14
            )
        );

    // A bit: level per cycle, transitions on the rising edge.
    const bit = (row, levels, color = GREY, alpha = 0.7) => {
        const y = rowY(row);
        const pts = [];
        levels.forEach((l, k) => {
            const x = tx0 + k * cyc;
            const yy = l ? y - hh : y + hh;
            if (k && levels[k - 1] !== l) pts.push([x, l ? y + hh : y - hh]);
            if (!k || levels[k - 1] !== l) pts.push([x, yy]);
        });
        pts.push([tx1, levels[levels.length - 1] ? y - hh : y + hh]);
        parts.push(stroke(poly(pts), color, alpha, { cap: "butt" }));
    };

    // Clock: half-cycle square wave.
    {
        const y = rowY(0);
        const pts = [[tx0, y + hh]];
        for (let k = 0; k < cycles; k++) {
            const x = tx0 + k * cyc;
            pts.push([x, y - hh], [x + cyc / 2, y - hh], [x + cyc / 2, y + hh], [x + cyc, y + hh]);
        }
        parts.push(stroke(poly(pts), GREY, 0.75, { cap: "butt" }));
    }

    const rst = Array.from({ length: cycles }, (_, k) => (k < 2 ? 1 : 0));
    const valid = Array.from({ length: cycles }, (_, k) => ((k >= 3 && k < 7) || (k >= 9 && k < 14) ? 1 : 0));
    const ready = Array.from({ length: cycles }, (_, k) => (k >= 2 && k !== 5 && k !== 11 ? 1 : 0));
    bit(1, rst);
    bit(2, valid);
    bit(4, ready);

    // The bus: a value held for a few cycles, crossing over at 45° where it changes.
    {
        const y = rowY(3);
        const edges = [0, 3, 5, 7, 9, 11, 14, cycles];
        for (let s = 0; s < edges.length - 1; s++) {
            const xa = tx0 + edges[s] * cyc;
            const xb = tx0 + edges[s + 1] * cyc;
            const live = valid[edges[s]] === 1;
            const k = 8;
            const d = poly([
                [xa, y],
                [xa + k, y - hh],
                [xb - k, y - hh],
                [xb, y],
                [xb - k, y + hh],
                [xa + k, y + hh],
                [xa, y],
            ]);
            parts.push(
                `<path d="${d}" fill="${GREY}" fill-opacity="${live ? 0.3 : 0.14}" stroke="${GREY}" stroke-opacity="0.7" stroke-width="2" stroke-linejoin="round"/>`
            );
            if (live)
                for (let q = xa + 22; q < xb - 22; q += 14)
                    parts.push(cell(q, y - 5, 10, GREY, lerp(0.4, 0.8, rand())));
        }
    }

    // The agent's bracket over the cycles it is reading, and the cursor on the one it is pointing at.
    const a0 = tx0 + 9 * cyc;
    const a1 = tx0 + 14 * cyc;
    const bTop = rowY(0) - hh - 24;
    parts.push(frame(a0 - 6, bTop, a1 - a0 + 12, rowY(4) + hh + 24 - bTop, BLUE, 0.7, { dash: "8 8", rx: 6 }));
    // The agent, reading: three dots at the bracket's corner.
    for (let i = 0; i < 3; i++) parts.push(cell(a0 + 2 + i * 16, bTop - 30, 12, BLUE, 0.9 - i * 0.25));
    const cx = tx0 + 11 * cyc;
    parts.push(
        stroke(
            poly([
                [cx, rowY(0) - hh - 46],
                [cx, rowY(4) + hh + 46],
            ]),
            ORANGE,
            0.95
        )
    );
    parts.push(cell(cx - 9, rowY(0) - hh - 64, 18, ORANGE, 1));
    parts.push(cell(cx - 9, rowY(4) + hh + 46, 18, ORANGE, 1));

    return svg(parts);
}

export const thumbs = {
    "mla-profiling": mlaProfiling,
    "tiny-gemm": tinyGemm,
    "atalla-kernels": atallaKernels,
    "riscv-cpu": riscvCpu,
    "graph-scheduling": graphScheduling,
    "sparse-attention": sparseAttention,
    verigen,
};

const wanted = process.argv.slice(2);
const slugs = wanted.length ? wanted : Object.keys(thumbs);
await mkdir(OUT, { recursive: true });
for (const slug of slugs) {
    const draw = thumbs[slug];
    if (!draw) throw new Error(`no thumbnail named ${slug}`);
    const out = join(OUT, `${slug}.svg`);
    const body = draw();
    await writeFile(out, body);
    console.log(`${slug}.svg  ${Math.round(body.length / 1024)}K`);
}
