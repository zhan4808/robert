import type { ReactNode } from "react";
import { Canvas, TONE, wash, type Tone } from "./kit";
import traced from "./traced.json";

/*
 * The series' measured charts, redrawn as themed SVG. Values are normalised shapes traced from the original
 * figures: axes carry no absolute numbers, by design.
 */

const W = 720;
const AXIS = "color-mix(in srgb, currentColor 22%, transparent)";
const GRID = "color-mix(in srgb, currentColor 8%, transparent)";

function Txt({
    x,
    y,
    children,
    anchor = "start",
    tone = "muted",
    size = 11,
    weight = 400,
    rotate,
}: {
    x: number;
    y: number;
    children: ReactNode;
    anchor?: "start" | "middle" | "end";
    tone?: Tone;
    size?: number;
    weight?: number;
    rotate?: boolean;
}) {
    return (
        <text
            x={x}
            y={y}
            fontSize={size * 1.14}
            fill={TONE[tone]}
            textAnchor={anchor}
            fontWeight={weight}
            transform={rotate ? `rotate(-90 ${x} ${y})` : undefined}
        >
            {children}
        </text>
    );
}

type Box = { x0: number; x1: number; y0: number; y1: number };
const px = (b: Box, fx: number) => b.x0 + fx * (b.x1 - b.x0);
const py = (b: Box, fy: number) => b.y1 - fy * (b.y1 - b.y0);

function Axes({ b, xlabel, ylabel }: { b: Box; xlabel: string; ylabel: string }) {
    return (
        <g>
            <line x1={b.x0} y1={b.y1} x2={b.x1} y2={b.y1} stroke={AXIS} />
            <line x1={b.x0} y1={b.y0} x2={b.x0} y2={b.y1} stroke={AXIS} />
            <Txt x={(b.x0 + b.x1) / 2} y={b.y1 + 38} anchor="middle">
                {xlabel}
            </Txt>
            <Txt x={b.x0 - 14} y={(b.y0 + b.y1) / 2} anchor="middle" rotate>
                {ylabel}
            </Txt>
        </g>
    );
}

function Series({
    b,
    pts,
    tone,
    dashed,
    width = 2.2,
}: {
    b: Box;
    pts: number[][];
    tone: Tone | "ink";
    dashed?: boolean;
    width?: number;
}) {
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${px(b, x).toFixed(1)},${py(b, y).toFixed(1)}`).join(" ");
    return (
        <path
            d={d}
            fill="none"
            stroke={TONE[tone]}
            strokeWidth={width}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={dashed ? "7 5" : undefined}
        />
    );
}

function Ticks({ b, ticks }: { b: Box; ticks: Record<string, number> }) {
    return (
        <g>
            {Object.entries(ticks).map(([lab, f]) => (
                <g key={lab}>
                    <line x1={px(b, f)} y1={b.y1} x2={px(b, f)} y2={b.y1 + 5} stroke={AXIS} />
                    <Txt x={px(b, f)} y={b.y1 + 19} anchor="middle">
                        {lab}
                    </Txt>
                </g>
            ))}
        </g>
    );
}

/** Part 1: share of all-reduce time split into startup, transfer and residual wait. */
export function BreakdownChart() {
    const panels = [
        ["8 GPUs, one PCIe box", traced.breakdown.oneBox],
        ["16 GPUs, two boxes over RoCE", traced.breakdown.twoBoxes],
    ] as const;
    const parts: [keyof (typeof traced.breakdown.oneBox)[number], Tone, string][] = [
        ["s", "blue", "startup"],
        ["t", "green", "transfer"],
        ["r", "orange", "residual wait"],
    ];
    return (
        <Canvas
            w={W}
            h={300}
            title="Share of all-reduce time by concurrency, split into startup, transfer and residual wait"
        >
            {parts.map(([, t, lab], i) => (
                <g key={lab}>
                    <rect x={200 + i * 120} y={8} width={12} height={12} rx={2} fill={TONE[t]} />
                    <Txt x={218 + i * 120} y={18} tone="ink" size={12}>
                        {lab}
                    </Txt>
                </g>
            ))}
            {panels.map(([title, bars], p) => {
                const b: Box = { x0: 40 + p * 350, x1: 350 + p * 350, y0: 54, y1: 246 };
                const bw = 30;
                return (
                    <g key={title}>
                        <Txt x={b.x0} y={44} tone="ink" size={12} weight={600}>
                            {title}
                        </Txt>
                        <line x1={b.x0} y1={b.y1} x2={b.x1} y2={b.y1} stroke={AXIS} />
                        {bars.map((bar, i) => {
                            const cx = b.x0 + 26 + i * 50;
                            let acc = 0;
                            return (
                                <g key={i}>
                                    {parts.map(([k, t]) => {
                                        const v = bar[k];
                                        const y = py(b, acc + v);
                                        const h = v * (b.y1 - b.y0);
                                        acc += v;
                                        return h > 0.5 ? (
                                            <rect
                                                key={k}
                                                x={cx - bw / 2}
                                                y={y}
                                                width={bw}
                                                height={Math.max(h - 1.5, 0.5)}
                                                rx={2}
                                                fill={TONE[t]}
                                                opacity={0.9}
                                            />
                                        ) : null;
                                    })}
                                    <Txt x={cx} y={b.y1 + 17} anchor="middle">
                                        {traced.breakdown.labels[i]}
                                    </Txt>
                                </g>
                            );
                        })}
                        <Txt x={(b.x0 + b.x1) / 2} y={b.y1 + 38} anchor="middle">
                            concurrent requests
                        </Txt>
                    </g>
                );
            })}
        </Canvas>
    );
}

/** Part 1: time per all-reduce against message size, one box vs two over Ethernet. */
export function LatencyChart() {
    const b: Box = { x0: 50, x1: 700, y0: 20, y1: 230 };
    const [s0, s1] = traced.latency_shade;
    return (
        <Canvas
            w={W}
            h={286}
            title="Time per all-reduce against message size, one PCIe box against two boxes over Ethernet"
        >
            <rect x={px(b, s0)} y={b.y0} width={px(b, s1) - px(b, s0)} height={b.y1 - b.y0} fill={wash("blue", 6)} />
            <Txt x={(px(b, s0) + px(b, s1)) / 2} y={b.y0 + 16} anchor="middle" tone="blue" weight={600}>
                decode sizes
            </Txt>
            <Axes b={b} xlabel="all-reduce message size (log)" ylabel="time per call (log)" />
            <Ticks b={b} ticks={traced.latency_ticks} />
            <Series b={b} pts={traced.latency.one_box} tone="blue" />
            <Series b={b} pts={traced.latency.two_boxes} tone="orange" />
            <Txt x={px(b, 0.04)} y={py(b, 0.12)} tone="blue" size={12} weight={600}>
                8 GPUs, one box
            </Txt>
            <Txt x={px(b, 0.04)} y={py(b, 0.47)} tone="orange" size={12} weight={600}>
                16 GPUs, two boxes over Ethernet
            </Txt>
        </Canvas>
    );
}

/** Part 1: communication share of a decode step at TP4, TP8, TP16. */
export function ShareChart() {
    const b: Box = { x0: 50, x1: 540, y0: 20, y1: 230 };
    const xs = traced.share_labels.map((_, i) => 0.04 + i * 0.184);
    const series: [keyof typeof traced.share, Tone, string][] = [
        ["tp16", "green", "TP16, two boxes over Ethernet"],
        ["tp8", "orange", "TP8, one box"],
        ["tp4", "blue", "TP4, one box"],
    ];
    return (
        <Canvas w={W} h={286} title="Communication share of a decode step at TP4, TP8 and TP16">
            {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1={b.x0} x2={b.x1} y1={py(b, g)} y2={py(b, g)} stroke={GRID} />
            ))}
            <Axes b={b} xlabel="concurrent requests" ylabel="communication share of step" />
            {traced.share_labels.map((l, i) => (
                <Txt key={l} x={px(b, xs[i])} y={b.y1 + 19} anchor="middle">
                    {l}
                </Txt>
            ))}
            {series.map(([k, t, lab]) => {
                const pts = traced.share[k].map((y, i) => [xs[i], y]);
                const last = pts[pts.length - 1];
                return (
                    <g key={k}>
                        <Series b={b} pts={pts} tone={t} />
                        {pts.map(([x, y], i) => (
                            <circle key={i} cx={px(b, x)} cy={py(b, y)} r={3.5} fill={TONE[t]} />
                        ))}
                        <Txt x={px(b, last[0]) + 12} y={py(b, last[1]) + 4} tone={t} size={12} weight={600}>
                            {lab}
                        </Txt>
                    </g>
                );
            })}
        </Canvas>
    );
}

/** Part 2: each algorithm and protocol forced on 16 GPUs over Ethernet, NCCL's default dashed. */
export function ForcedChart() {
    const b: Box = { x0: 50, x1: 600, y0: 14, y1: 240 };
    const series: [keyof typeof traced.forced, Tone | "ink", string, boolean][] = [
        ["ring_ll", "blue", "Ring / LL", false],
        ["ring_ll128", "orange", "Ring / LL128", false],
        ["ring_simple", "green", "Ring / Simple", false],
        ["tree_ll", "purple", "Tree / LL", false],
        ["default", "ink", "NCCL default", true],
    ];
    return (
        <Canvas
            w={W}
            h={296}
            title="Each NCCL algorithm and protocol forced on 16 GPUs over Ethernet, with the default dashed"
        >
            <Axes b={b} xlabel="all-reduce message size (log)" ylabel="time per call (log), lower is better" />
            <Ticks b={b} ticks={traced.forced_ticks} />
            {series.map(([k, t, , dashed]) => (
                <Series key={k} b={b} pts={traced.forced[k]} tone={t} dashed={dashed} width={dashed ? 2 : 2.2} />
            ))}
            {series.map(([k, t, lab, dashed], i) => (
                <g key={`l-${k}`}>
                    <line
                        x1={620}
                        x2={642}
                        y1={40 + i * 22}
                        y2={40 + i * 22}
                        stroke={TONE[t]}
                        strokeWidth={2.4}
                        strokeDasharray={dashed ? "6 4" : undefined}
                    />
                    <Txt x={648} y={44 + i * 22} tone="ink" size={11}>
                        {lab}
                    </Txt>
                </g>
            ))}
        </Canvas>
    );
}
