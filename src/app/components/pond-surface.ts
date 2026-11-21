/**
 * The shared language of the pond's surfaces: the koi banner and the photos that surface from it are both drawn on
 * the same grid of near-square tiles, and both end at the edge in a scatter of tiles rather than a straight line.
 */

/** The tile grid the koi renderer uses for a canvas this wide, so every surface lines up with the koi. */
export function tileSize(width: number) {
    const cw = Math.min(12, Math.max(8, Math.round(width / 125)));
    return { cw, ch: cw + 2 };
}

/** A 4x4 ordered-dither matrix, scaled to 0..1: the threshold each cell has to beat to be drawn. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
export const bayer = (c: number, r: number) => BAYER[(r & 3) * 4 + (c & 3)];

function hash(x: number, y: number, seed: number) {
    let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const fade = (t: number) => t * t * (3 - 2 * t);

/** Smooth value noise in 0..1. */
export function noise(x: number, y: number, seed = 0) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const a = hash(xi, yi, seed);
    const b = hash(xi + 1, yi, seed);
    const c = hash(xi, yi + 1, seed);
    const d = hash(xi + 1, yi + 1, seed);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/**
 * Which tiles of a cols x rows grid survive the shoreline: fully kept in the middle, thinning out over `band` tiles
 * toward each edge by ordered dither, with low-frequency noise so the edge wanders like a bank instead of a frame.
 */
export function shoreline(cols: number, rows: number, band: number, seed: number) {
    const keep = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const d = Math.min(c + 0.5, cols - c - 0.5, (r + 0.5) * 1.15, (rows - r - 0.5) * 1.15);
            const wander = (noise(c * 0.13, r * 0.22, seed) - 0.5) * 0.9;
            const t = d / band + wander;
            keep[r * cols + c] = t > bayer(c, r) ? 1 : 0;
        }
    }
    return keep;
}

/** The shoreline as a mask image the size of the element, one crisp square per kept tile. */
export function shorelineMask(width: number, height: number, cw: number, ch: number, band: number, seed: number) {
    const cols = Math.ceil(width / cw);
    const rows = Math.ceil(height / ch);
    const keep = shoreline(cols, rows, band, seed);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return { url: "", keep, cols, rows };
    ctx.fillStyle = "#000";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) if (keep[r * cols + c]) ctx.fillRect(c * cw, r * ch, cw, ch);
    }
    return { url: canvas.toDataURL("image/png"), keep, cols, rows };
}

/** Density ramp for glyphs etched into a tile: sparse where it is light, dense where it is dark. */
export const TILE_GLYPHS = " .:-=+*#%@";

/** A line glyph that follows a direction, for ripple rings. */
export function lineGlyph(dx: number, dy: number) {
    const d = Math.hypot(dx, dy) || 1;
    if (Math.abs(dy) < 0.38 * d) return "|";
    if (Math.abs(dx) < 0.38 * d) return "-";
    return dx * dy > 0 ? "/" : "\\";
}

export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/**
 * An irregular pond on the tile grid: a rounded oval pushed out into lobes and in at a waist by a few low harmonics,
 * like a dug backyard pond. Every tile is either in the water or not, so the edge is a clean stepped line with no
 * stray tiles. Also returns the outline as a signed distance in px (negative in the water) for the koi to steer by.
 */
export function pondMask(width: number, height: number, cw: number, ch: number) {
    const cols = Math.ceil(width / cw);
    const rows = Math.ceil(height / ch);
    const cx = width / 2;
    const cy = height / 2;
    const ry = height / 2 - ch * 0.5;
    const rx = Math.min(width / 2 - cw * 0.5, ry * 2.6);
    const raw = (t: number) =>
        1 +
        0.07 * Math.sin(2 * t + 0.6) +
        0.08 * Math.sin(3 * t + 2.1) +
        0.035 * Math.sin(4 * t + 1.2) +
        0.02 * Math.sin(6 * t + 0.4);
    let max = 0;
    for (let i = 0; i < 360; i++) max = Math.max(max, raw((i / 360) * Math.PI * 2));
    const outline = (x: number, y: number) => {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        return (Math.hypot(dx, dy) - raw(Math.atan2(dy, dx)) / max) * ry;
    };
    const keep = new Uint8Array(cols * rows);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) keep[r * cols + c] = outline(c * cw + cw / 2, r * ch + ch / 2) < 0 ? 1 : 0;
    }
    let url = "";
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.fillStyle = "#000";
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) if (keep[r * cols + c]) ctx.fillRect(c * cw, r * ch, cw, ch);
        }
        url = canvas.toDataURL("image/png");
    }
    return { url, keep, cols, rows, outline };
}
