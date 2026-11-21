import type { ReactNode } from "react";
import { Canvas, TONE, wash, type Tone } from "./kit";
import traced from "./traced.json";

/*
 * The series' measured charts, redrawn as themed SVG. Values are normalised shapes traced from the original
 * figures: axes carry no absolute numbers, by design.
 */

const W = 720;
const AXIS = "color-mix(in srgb, currentColor 22%, transparent)";

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
            {/* Under the blue curve's climb, right of the band: at the left edge the two curves sit too close for a label. */}
            <Txt x={px(b, 0.745)} y={py(b, 0.25)} tone="blue" size={12} weight={600}>
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
    // x1 leaves room on the right for the longest end label ("TP16, two boxes over Ethernet") inside the 720 canvas.
    const b: Box = { x0: 50, x1: 480, y0: 20, y1: 230 };
    const xs = traced.share_labels.map((_, i) => 0.04 + i * 0.184);
    const series: [keyof typeof traced.share, Tone, string][] = [
        ["tp16", "green", "TP16, two boxes over Ethernet"],
        ["tp8", "orange", "TP8, one box"],
        ["tp4", "blue", "TP4, one box"],
    ];
    return (
        <Canvas w={W} h={286} title="Communication share of a decode step at TP4, TP8 and TP16">
            {/* No gridlines or y ticks: the curves are traced from rig runs, so only their order and shape show. */}
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

/*
 * Part 3's trend figures. These are not traced from measurements: they draw the measured ordering (which layout is
 * ahead, where one overtakes another, where one flattens) with smooth curves on unlabeled axes, so the shape reads
 * and no value does.
 *
 * The rules they encode, all stated in the post:
 * - One 8-GPU box flattens once its KV cache is full.
 * - Two independent TP8 replicas are each a box at half the load, so their curve is the one box's, shifted right
 *   by a factor of two in concurrency and doubled. They never cross the network, so it's the same on both fabrics.
 * - Over Ethernet, TP16 trails one box until that box runs out of KV cache, then passes it; tuning NCCL lifts it a
 *   lot at high load and not at all at low load; it stays below two replicas everywhere.
 * - Over the PCIe fabric, TP16 pulls ahead of one box from medium concurrency. TP16 against two replicas wasn't
 *   measured on that rack, so that pairing isn't drawn there.
 */

// Concurrency runs from 1 to 512 requests; the x axis is its log, the curves are functions of the real value.
const conc = (x: number) => 2 ** (9 * x);
/** Throughput that grows with load and flattens at a layout's KV-cache cap: cap · (1 − e^(−c/c0)). */
const flattening = (c: number, cap: number, c0: number) => cap * (1 - Math.exp(-c / c0));
const oneBoxAt = (c: number) => flattening(c, 0.42, 40);
const oneBox = (x: number) => oneBoxAt(conc(x));
/** Two replicas each serve half the requests: 2 · T(c / 2). Same slope as one box at low load, twice the cap. */
const twoReplicas = (x: number) => 2 * oneBoxAt(conc(x) / 2);
/** TP16 over Ethernet: a lower slope (every step pays the crossing), but twice the KV pool, so a higher, later cap. */
const tp16Ethernet = (x: number) => flattening(conc(x), 0.6, 110);
/** Tuning NCCL helps only where messages are large, i.e. at high load. */
const tp16EthernetTuned = (x: number) => tp16Ethernet(x) + 0.16 * (1 - Math.exp(-conc(x) / 300)) ** 2;
/** TP16 over the PCIe fabric: the crossing is cheap, so it keeps one box's slope and adds the bigger pool. */
const tp16Pcie = (x: number) => flattening(conc(x), 0.8, 76);
const Y_TOP = 0.95;

const sample = (f: (x: number) => number) =>
    Array.from({ length: 91 }, (_, i) => [i / 90, Math.max(0, f(i / 90)) / Y_TOP]);

function RegionBand({ b, from, to, tone, label }: { b: Box; from: number; to: number; tone: Tone; label: string }) {
    return (
        <g>
            <rect x={px(b, from)} y={b.y0} width={px(b, to) - px(b, from)} height={b.y1 - b.y0} fill={wash(tone, 7)} />
            <Txt x={px(b, from) + 8} y={b.y0 + 16} tone={tone} weight={600}>
                {label}
            </Txt>
        </g>
    );
}

function LineLabel({
    b,
    x,
    y,
    tone,
    children,
}: {
    b: Box;
    x: number;
    y: number;
    tone: Tone | "ink";
    children: ReactNode;
}) {
    return (
        // A halo in the page colour keeps the label legible where a neighbouring curve runs through it.
        <text
            x={px(b, x)}
            y={py(b, y / Y_TOP)}
            fontSize={12.5}
            fill={TONE[tone]}
            fontWeight={600}
            textAnchor="end"
            stroke="var(--background-color)"
            strokeWidth={7}
            strokeLinejoin="round"
            paintOrder="stroke"
        >
            {children}
        </text>
    );
}

/** Part 3: throughput against concurrency for each layout, one panel per fabric, with the winner shaded. */
export function ScaleUpTrends() {
    const eth: Box = { x0: 44, x1: 344, y0: 40, y1: 250 };
    const pcie: Box = { x0: 404, x1: 704, y0: 40, y1: 250 };
    const ticks = { low: 2 / 9, medium: 5 / 9, high: 0.96 } as const;
    const panel = (b: Box, title: string) => (
        <g>
            <Txt x={b.x0} y={24} tone="ink" size={12} weight={600}>
                {title}
            </Txt>
            <line x1={b.x0} y1={b.y1} x2={b.x1} y2={b.y1} stroke={AXIS} />
            <line x1={b.x0} y1={b.y0} x2={b.x0} y2={b.y1} stroke={AXIS} />
            {Object.entries(ticks).map(([lab, f]) => (
                <Txt key={lab} x={px(b, f)} y={b.y1 + 18} anchor="middle">
                    {lab}
                </Txt>
            ))}
            <Txt x={(b.x0 + b.x1) / 2} y={b.y1 + 38} anchor="middle">
                concurrent requests (log)
            </Txt>
        </g>
    );
    return (
        <Canvas
            w={W}
            h={300}
            title="Throughput against concurrency for each layout over Ethernet and over a PCIe fabric"
        >
            <Txt x={30} y={145} anchor="middle" rotate>
                throughput →
            </Txt>
            <RegionBand b={eth} from={0} to={1} tone="green" label="two replicas win throughout" />
            <RegionBand b={pcie} from={0} to={0.47} tone="blue" label="one box is enough" />
            <RegionBand b={pcie} from={0.47} to={1} tone="orange" label="TP16 pulls ahead" />
            {panel(eth, "RoCE Ethernet")}
            {panel(pcie, "PCIe switch fabric")}

            <Series b={eth} pts={sample(twoReplicas)} tone="green" />
            <Series b={eth} pts={sample(oneBox)} tone="blue" />
            <Series b={eth} pts={sample(tp16Ethernet)} tone="orange" dashed />
            <Series b={eth} pts={sample(tp16EthernetTuned)} tone="orange" />
            <LineLabel b={eth} x={0.99} y={twoReplicas(1) + 0.04} tone="green">
                2 × TP8
            </LineLabel>
            <LineLabel b={eth} x={0.99} y={tp16EthernetTuned(1) + 0.035} tone="orange">
                TP16, tuned NCCL
            </LineLabel>
            <LineLabel b={eth} x={0.99} y={tp16Ethernet(1) - 0.115} tone="orange">
                TP16, stock
            </LineLabel>
            <LineLabel b={eth} x={0.99} y={oneBox(1) - 0.05} tone="blue">
                one box (TP8)
            </LineLabel>

            <Series b={pcie} pts={sample(oneBox)} tone="blue" />
            <Series b={pcie} pts={sample(tp16Pcie)} tone="orange" />
            <LineLabel b={pcie} x={0.99} y={tp16Pcie(1) - 0.06} tone="orange">
                TP16 across both boxes
            </LineLabel>
            <LineLabel b={pcie} x={0.99} y={oneBox(1) - 0.05} tone="blue">
                one box (TP8)
            </LineLabel>
        </Canvas>
    );
}

/** Part 3: which layout to run, by fabric and load, as one map. */
export function LayoutMap() {
    const cols = ["low concurrency", "medium", "high concurrency"];
    const rows: { label: string; sub: string; cells: [string, Tone][] }[] = [
        {
            label: "RoCE Ethernet",
            sub: "16 GPUs, two boxes",
            cells: [
                ["2 × TP8 replicas", "green"],
                ["2 × TP8 replicas", "green"],
                ["2 × TP8 replicas", "green"],
            ],
        },
        {
            label: "PCIe switch fabric",
            sub: "16 GPUs, two boxes",
            cells: [
                ["one box, TP8", "blue"],
                ["TP16", "orange"],
                ["TP16", "orange"],
            ],
        },
        {
            label: "Long-context MLA",
            sub: "KV-bound, either fabric",
            cells: [
                ["PP2 × TP8", "purple"],
                ["PP2 × TP8", "purple"],
                ["PP2 × TP8", "purple"],
            ],
        },
    ];
    const x0 = 170;
    const cw = (W - x0 - 10) / 3;
    const rh = 58;
    const y0 = 34;
    return (
        <Canvas w={W} h={y0 + rh * rows.length + 8} title="Which layout to run by fabric and load">
            {cols.map((c, i) => (
                <Txt key={c} x={x0 + cw * i + cw / 2} y={20} anchor="middle">
                    {c}
                </Txt>
            ))}
            {rows.map((row, r) => {
                const y = y0 + r * rh;
                return (
                    <g key={row.label}>
                        <Txt x={10} y={y + 25} tone="ink" size={12} weight={600}>
                            {row.label}
                        </Txt>
                        <Txt x={10} y={y + 42} size={10.5}>
                            {row.sub}
                        </Txt>
                        {row.cells.map(([text, tone], c) => {
                            // Merge runs of the same answer into one cell, so the map reads as regions.
                            if (c > 0 && row.cells[c - 1][0] === text) return null;
                            let span = 1;
                            while (c + span < 3 && row.cells[c + span][0] === text) span++;
                            const x = x0 + cw * c + 3;
                            return (
                                <g key={c}>
                                    <rect
                                        x={x}
                                        y={y + 4}
                                        width={cw * span - 6}
                                        height={rh - 10}
                                        rx={7}
                                        fill={wash(tone, 16)}
                                        stroke={wash(tone, 45)}
                                    />
                                    <Txt
                                        x={x + (cw * span - 6) / 2}
                                        y={y + rh / 2 + 4}
                                        anchor="middle"
                                        tone="ink"
                                        size={12.5}
                                        weight={500}
                                    >
                                        {text}
                                    </Txt>
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </Canvas>
    );
}
