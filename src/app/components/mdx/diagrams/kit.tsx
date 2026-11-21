import type { ReactNode } from "react";
import rough from "roughjs";

/**
 * A tiny drawing kit for the write-ups' diagrams: Excalidraw-style strokes from rough.js, rendered on the server as
 * inline SVG. Nothing has a background; ink is the page's foreground colour, secondary text the muted colour, and the
 * four accents are mid-tones that read on both the light and the dark paper.
 */

const gen = rough.generator();

export const TONE = {
    ink: "currentColor",
    muted: "var(--muted-color)",
    faint: "color-mix(in srgb, currentColor 30%, transparent)",
    blue: "#4a86e8",
    green: "#2fae7d",
    orange: "#e8774a",
    purple: "#8b74e8",
} as const;
export type Tone = keyof typeof TONE;

/** The accent at low opacity, for fills that sit quietly on either paper. */
export const wash = (tone: Tone, pct = 22) => `color-mix(in srgb, ${TONE[tone]} ${pct}%, transparent)`;

type ShapeOpts = { tone?: Tone; fill?: string; dashed?: boolean; width?: number; rough?: number };
type TextOpts = {
    size?: number;
    tone?: Tone;
    anchor?: "start" | "middle" | "end";
    weight?: number;
    mono?: boolean;
    italic?: boolean;
};

export class Sketch {
    private seed: number;
    readonly els: ReactNode[] = [];
    private key = 0;

    constructor(name: string) {
        // A stable seed per diagram, so the wobble is the same on every build.
        this.seed = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 100000, 7) + 1;
    }

    private opts(o: ShapeOpts) {
        return {
            seed: this.seed++,
            roughness: o.rough ?? 0.9,
            bowing: 0.6,
            stroke: TONE[o.tone ?? "ink"],
            strokeWidth: o.width ?? 1.5,
            fill: o.fill,
            fillStyle: "solid" as const,
            strokeLineDash: o.dashed ? [6, 5] : undefined,
            disableMultiStroke: !!o.dashed,
        };
    }

    private push(drawable: ReturnType<typeof gen.rectangle>) {
        for (const p of gen.toPaths(drawable)) {
            this.els.push(
                <path
                    key={this.key++}
                    d={p.d}
                    stroke={p.stroke === "none" ? "none" : p.stroke}
                    strokeWidth={p.strokeWidth}
                    fill={p.fill ?? "none"}
                    strokeDasharray={drawable.options.strokeLineDash?.join(" ")}
                    strokeLinecap="round"
                />
            );
        }
        return this;
    }

    rect(x: number, y: number, w: number, h: number, o: ShapeOpts = {}) {
        return this.push(gen.rectangle(x, y, w, h, this.opts(o)));
    }

    line(x1: number, y1: number, x2: number, y2: number, o: ShapeOpts = {}) {
        return this.push(gen.line(x1, y1, x2, y2, this.opts(o)));
    }

    /** A line with an open arrowhead at its end. */
    arrow(x1: number, y1: number, x2: number, y2: number, o: ShapeOpts = {}) {
        this.line(x1, y1, x2, y2, o);
        const a = Math.atan2(y2 - y1, x2 - x1);
        const len = 9;
        for (const da of [0.45, -0.45]) {
            this.line(x2, y2, x2 - len * Math.cos(a + da), y2 - len * Math.sin(a + da), { ...o, dashed: false });
        }
        return this;
    }

    /** A polyline through points, with an arrowhead on the last segment. */
    route(points: [number, number][], o: ShapeOpts & { head?: boolean } = {}) {
        for (let i = 0; i < points.length - 1; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[i + 1];
            if (i === points.length - 2 && o.head !== false) this.arrow(x1, y1, x2, y2, o);
            else this.line(x1, y1, x2, y2, o);
        }
        return this;
    }

    circle(x: number, y: number, d: number, o: ShapeOpts = {}) {
        return this.push(gen.circle(x, y, d, this.opts(o)));
    }

    curve(points: [number, number][], o: ShapeOpts = {}) {
        return this.push(gen.curve(points, this.opts(o)));
    }

    text(x: number, y: number, s: string, o: TextOpts = {}) {
        this.els.push(
            <text
                key={this.key++}
                x={x}
                y={y}
                fontSize={o.size ?? 13}
                fill={TONE[o.tone ?? "ink"]}
                textAnchor={o.anchor ?? "start"}
                fontWeight={o.weight ?? 400}
                fontStyle={o.italic ? "italic" : undefined}
                fontFamily={o.mono ? "var(--font-geist-mono), ui-monospace, monospace" : "inherit"}
            >
                {s}
            </text>
        );
        return this;
    }

    /** Text centred in a box, one entry per line. */
    label(cx: number, cy: number, lines: string[], o: TextOpts = {}) {
        const size = o.size ?? 13;
        const lh = size * 1.3;
        lines.forEach((l, i) =>
            this.text(cx, cy + (i - (lines.length - 1) / 2) * lh + size * 0.35, l, { anchor: "middle", ...o })
        );
        return this;
    }

    /** A box with a centred label. */
    box(x: number, y: number, w: number, h: number, lines: string[], o: ShapeOpts & TextOpts = {}) {
        this.rect(x, y, w, h, { fill: o.fill ?? (o.tone && o.tone !== "ink" ? wash(o.tone) : undefined), ...o });
        return this.label(x + w / 2, y + h / 2, lines, {
            size: o.size,
            weight: o.weight ?? 500,
            tone: "ink",
            mono: o.mono,
        });
    }

    /** A bracket under a span, with a label beneath it. */
    brace(x1: number, x2: number, y: number, s: string, tone: Tone = "muted") {
        this.route(
            [
                [x1, y - 6],
                [x1, y],
                [x2, y],
                [x2, y - 6],
            ],
            { tone, head: false, width: 1.3 }
        );
        return this.text((x1 + x2) / 2, y + 18, s, { anchor: "middle", tone, size: 12, weight: 500 });
    }
}

/** The SVG shell: scales to the column, no background, text in the page's font. */
export function Canvas({ w, h, title, children }: { w: number; h: number; title: string; children: ReactNode }) {
    return (
        <svg
            viewBox={`0 0 ${w} ${h}`}
            width="100%"
            role="img"
            aria-label={title}
            className="block h-auto w-full overflow-visible text-foreground"
            style={{ maxWidth: w }}
        >
            <title>{title}</title>
            {children}
        </svg>
    );
}
