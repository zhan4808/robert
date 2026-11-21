import { Canvas, Sketch, wash, type Tone } from "./kit";

/*
 * Explanatory drawings for the "LLM inference without NVLink" series. Concepts and public arithmetic only: nothing
 * here encodes a measurement.
 */

const W = 720;

/** Eight GPU squares in a row. */
function gpus(
    s: Sketch,
    x: number,
    y: number,
    n: number,
    size: number,
    gap: number,
    tone: Tone = "blue",
    from = 0,
    labels = true
) {
    for (let i = 0; i < n; i++) {
        const gx = x + i * (size + gap);
        s.rect(gx, y, size, size, { tone, fill: wash(tone, 30), rough: 0.7 });
        if (labels) s.label(gx + size / 2, y + size / 2, [String(from + i)], { size: 11, tone: "ink", weight: 500 });
    }
}

// ─── Part 1 ──────────────────────────────────────────────────────────────────

export function Rig() {
    const s = new Sketch("rig");
    const boxW = 290;
    for (const [i, bx] of [20, 410].entries()) {
        s.rect(bx, 20, boxW, 190, { tone: "muted", rough: 0.6 });
        s.text(bx + 14, 42, `box ${"AB"[i]}`, { weight: 600 });
        s.text(bx + boxW - 14, 42, "8 GPUs, no NVLink", { anchor: "end", tone: "muted", size: 12 });
        gpus(s, bx + 17, 58, 8, 26, 7, "blue", i * 8);
        for (let g = 0; g < 8; g++) s.line(bx + 30 + g * 33, 84, bx + 30 + g * 33, 104, { tone: "faint", width: 1.2 });
        s.box(bx + 17, 104, 256, 30, ["PCIe switch"], { tone: "ink", fill: "none" });
        s.line(bx + 145, 134, bx + 145, 156, { tone: "faint", width: 1.2 });
        s.box(bx + 105, 156, 80, 28, ["NICs"], { tone: "green" });
    }
    // Ethernet between the boxes
    s.box(318, 232, 84, 40, ["Ethernet", "switch"], { tone: "orange", size: 12 });
    s.route(
        [
            [165, 184],
            [165, 252],
            [318, 252],
        ],
        { tone: "orange", head: false, width: 2 }
    );
    s.route(
        [
            [555, 184],
            [555, 252],
            [402, 252],
        ],
        { tone: "orange", head: false, width: 2 }
    );
    s.text(360, 300, "400G RoCE: any tensor-parallel group larger than 8 crosses here", {
        anchor: "middle",
        tone: "muted",
        size: 12,
    });
    return (
        <Canvas w={W} h={312} title="Two 8-GPU PCIe boxes joined by RoCE Ethernet through one switch">
            {s.els}
        </Canvas>
    );
}

export function TpBlock() {
    const s = new Sketch("tp");
    const tones: Tone[] = ["blue", "green", "orange", "purple"];
    s.box(10, 128, 62, 64, ["x"], { size: 18 });
    s.text(41, 210, "same input", { anchor: "middle", size: 11, tone: "muted" });
    s.text(41, 224, "on every GPU", { anchor: "middle", size: 11, tone: "muted" });
    for (let i = 0; i < 4; i++) {
        const y = 22 + i * 70;
        const t = tones[i];
        s.text(112, y + 2, `GPU ${i}`, { size: 11, tone: "muted", weight: 500 });
        s.line(72, 160, 108, y + 25, { tone: "faint", width: 1.2 });
        s.box(112, y + 8, 112, 34, [`× W₁ part ${i}`], { tone: t, size: 12 });
        s.arrow(228, y + 25, 256, y + 25, { tone: "faint", width: 1.2 });
        s.box(260, y + 8, 112, 34, [`× W₂ part ${i}`], { tone: t, size: 12 });
        s.arrow(376, y + 25, 404, y + 25, { tone: "faint", width: 1.2 });
        s.box(408, y + 8, 56, 34, [`y${"₀₁₂₃"[i]}`], { size: 14 });
        s.line(464, y + 25, 512, 160, { tone: t, width: 1.4 });
    }
    s.circle(538, 160, 50, { tone: "ink", width: 1.8 });
    s.text(538, 167, "Σ", { anchor: "middle", size: 20, weight: 600 });
    s.text(538, 206, "all-reduce", { anchor: "middle", size: 13, weight: 600 });
    s.arrow(565, 160, 602, 160, { width: 1.6 });
    s.box(606, 132, 104, 56, ["y = Σ yᵢ"], { size: 14 });
    s.text(658, 206, "on every GPU", { anchor: "middle", size: 11, tone: "muted" });
    s.text(168, 312, "W₁ split by columns", { anchor: "middle", size: 11, tone: "muted" });
    s.text(316, 312, "W₂ split by rows", { anchor: "middle", size: 11, tone: "muted" });
    s.text(436, 312, "partial sums", { anchor: "middle", size: 11, tone: "muted" });
    return (
        <Canvas w={W} h={322} title="Tensor parallelism in one block: split weights, partial outputs, all-reduce">
            {s.els}
        </Canvas>
    );
}

function ringStates(n: number) {
    type Grid = Set<number>[][];
    const clone = (g: Grid) => g.map((r) => r.map((c) => new Set(c)));
    let state: Grid = Array.from({ length: n }, (_, g) => Array.from({ length: n }, () => new Set([g])));
    const snaps: { title: string; grid: Grid; moved: Set<string>; phase: Tone }[] = [
        { title: "start", grid: clone(state), moved: new Set(), phase: "muted" },
    ];
    for (let st = 0; st < n - 1; st++) {
        const next = clone(state);
        const moved = new Set<string>();
        for (let g = 0; g < n; g++) {
            const c = (((g - st) % n) + n) % n;
            const r = (g + 1) % n;
            for (const v of state[g][c]) next[r][c].add(v);
            moved.add(`${r},${c}`);
        }
        state = next;
        snaps.push({ title: `reduce-scatter ${st + 1}`, grid: clone(state), moved, phase: "orange" });
    }
    for (let st = 0; st < n - 1; st++) {
        const next = clone(state);
        const moved = new Set<string>();
        for (let g = 0; g < n; g++) {
            const c = (((g + 1 - st) % n) + n) % n;
            const r = (g + 1) % n;
            next[r][c] = new Set(state[g][c]);
            moved.add(`${r},${c}`);
        }
        state = next;
        snaps.push({ title: `all-gather ${st + 1}`, grid: clone(state), moved, phase: "green" });
    }
    return snaps;
}

export function RingAllReduce() {
    const s = new Sketch("ring");
    const n = 4;
    const cell = 22;
    const snaps = ringStates(n);
    const place = (k: number): [number, number] => (k < 4 ? [30 + k * 172, 34] : [30 + (k - 3) * 172, 194]);
    snaps.forEach((snap, k) => {
        const [px, py] = place(k);
        s.text(px + 12 + (n * cell) / 2, py - 10, snap.title, {
            anchor: "middle",
            size: 12,
            tone: snap.phase,
            weight: 600,
        });
        for (let g = 0; g < n; g++) {
            s.text(px, py + g * cell + 15, String(g), { size: 10, tone: "muted", anchor: "middle" });
            for (let c = 0; c < n; c++) {
                const cnt = snap.grid[g][c].size;
                const hit = snap.moved.has(`${g},${c}`);
                s.rect(px + 12 + c * cell, py + g * cell, cell - 4, cell - 4, {
                    tone: hit ? "orange" : "faint",
                    width: hit ? 2 : 1,
                    fill: wash("blue", [0, 12, 34, 60, 100][cnt]),
                    rough: 0.6,
                });
            }
        }
        for (let c = 0; c < n; c++)
            s.text(px + 21 + c * cell, py + n * cell + 10, "abcd"[c], { size: 10, tone: "muted", anchor: "middle" });
        if (k !== 3 && k !== snaps.length - 1)
            s.arrow(px + 118, py + 42, px + 150, py + 42, { tone: "faint", width: 1.2 });
    });
    s.route(
        [
            [604, 128],
            [604, 152],
            [100, 152],
            [100, 176],
        ],
        { tone: "faint", width: 1.2 }
    );
    // legend
    const ly = 318;
    [1, 2, 3, 4].forEach((cnt, i) => {
        s.rect(30 + i * 128, ly - 12, 14, 14, {
            tone: "faint",
            width: 1,
            fill: wash("blue", [0, 12, 34, 60, 100][cnt]),
            rough: 0.5,
        });
        s.text(50 + i * 128, ly, cnt === 4 ? "all 4 summed" : `${cnt} GPU${cnt > 1 ? "s" : ""} summed`, {
            size: 11,
            tone: "muted",
        });
    });
    s.rect(546, ly - 12, 14, 14, { tone: "orange", width: 2, rough: 0.5 });
    s.text(566, ly, "just received", { size: 11, tone: "muted" });
    s.text(30, 346, "rows are GPUs, columns are the message's four chunks", { size: 11, tone: "muted" });
    return (
        <Canvas w={W} h={356} title="Ring all-reduce on four GPUs, step by step">
            {s.els}
        </Canvas>
    );
}

export function AlphaBeta() {
    const s = new Sketch("ab");
    const rows: [string, number, string, Tone][] = [
        ["decode: a few KB per call", 3, "startup dominates", "orange"],
        ["prefill: tens of MB per call", 52, "transfer dominates", "blue"],
    ];
    rows.forEach(([lab, tw, verdict, vt], r) => {
        const y = 34 + r * 92;
        s.text(20, y - 10, lab, { size: 13, weight: 600 });
        let x = 20;
        for (let k = 0; k < 6; k++) {
            s.rect(x, y, 30, 30, { tone: "orange", fill: wash("orange", 40), rough: 0.6 });
            x += 32;
            s.rect(x, y, tw, 30, { tone: "blue", fill: wash("blue", 40), rough: 0.6 });
            x += tw + 6;
        }
        s.text(W - 20, y + 20, verdict, { anchor: "end", size: 13, tone: vt, weight: 600 });
    });
    s.rect(20, 210, 14, 14, { tone: "orange", fill: wash("orange", 40), rough: 0.5 });
    s.text(40, 222, "α, paid every step: launch, signal the neighbour, wait for its flag", { size: 12, tone: "muted" });
    s.rect(20, 236, 14, 14, { tone: "blue", fill: wash("blue", 40), rough: 0.5 });
    s.text(40, 248, "moving one chunk: grows with the message", { size: 12, tone: "muted" });
    return (
        <Canvas w={W} h={262} title="Six ring steps at a small and a large message size">
            {s.els}
        </Canvas>
    );
}

export function MessageSizes() {
    const s = new Sketch("sizes");
    const x0 = 40;
    const x1 = 690;
    const lo = Math.log2(1024);
    const hi = Math.log2(256 * 1024 ** 2);
    const X = (b: number) => x0 + ((Math.log2(b) - lo) / (hi - lo)) * (x1 - x0);
    const y = 120;
    s.rect(X(8 * 1024), y - 18, X(4 * 1024 ** 2) - X(8 * 1024), 36, {
        tone: "blue",
        fill: wash("blue", 14),
        dashed: true,
        width: 1,
    });
    s.text((X(8 * 1024) + X(4 * 1024 ** 2)) / 2, y + 36, "decode: 1 to 512 requests in flight", {
        anchor: "middle",
        size: 12,
        tone: "blue",
        weight: 600,
    });
    s.line(x0, y, x1, y, { width: 1.6 });
    for (const [b, lab] of [
        [1024, "1 KiB"],
        [32 * 1024, "32 KiB"],
        [1024 ** 2, "1 MiB"],
        [32 * 1024 ** 2, "32 MiB"],
        [256 * 1024 ** 2, "256 MiB"],
    ] as const) {
        s.line(X(b), y - 5, X(b), y + 5, { width: 1.4 });
        s.text(X(b), y + 60, lab, { anchor: "middle", size: 11, tone: "muted", mono: true });
    }
    for (const [b, a, v, t] of [
        [8 * 1024, "1 request", "8 KiB", "blue"],
        [512 * 1024, "64 requests", "512 KiB", "blue"],
        [4 * 1024 ** 2, "512 requests", "4 MiB", "blue"],
        [64 * 1024 ** 2, "8,192-token prefill", "64 MiB", "orange"],
    ] as const) {
        s.circle(X(b), y, 11, { tone: t, fill: wash(t, 70) });
        s.line(X(b), y - 8, X(b), y - 34, { tone: t, width: 1.2 });
        s.text(X(b), y - 56, a, { anchor: "middle", size: 12, weight: 600 });
        s.text(X(b), y - 40, v, { anchor: "middle", size: 12, tone: t, mono: true });
    }
    s.text(x0, 24, "bytes = tokens in step × 4096 × 2", { size: 12, tone: "muted", mono: true });
    return (
        <Canvas w={W} h={196} title="All-reduce message sizes for hidden size 4096 in bf16">
            {s.els}
        </Canvas>
    );
}

export function EthCrossing() {
    const s = new Sketch("eth");
    const stages: [string[], Tone][] = [
        [["GPU"], "blue"],
        [["PCIe", "switch"], "ink"],
        [["NIC"], "orange"],
        [["wire +", "switch"], "muted"],
        [["NIC"], "orange"],
        [["PCIe", "switch"], "ink"],
        [["GPU"], "blue"],
    ];
    const bw = 78;
    const gap = 20;
    const y = 120;
    stages.forEach(([lab, t], i) => {
        const x = 12 + i * (bw + gap);
        s.box(x, y, bw, 46, lab, {
            tone: t,
            fill: t === "ink" || t === "muted" ? "none" : undefined,
            dashed: t === "muted",
            size: 12,
        });
        if (i < stages.length - 1) s.arrow(x + bw + 3, y + 23, x + bw + gap - 3, y + 23, { width: 1.3 });
    });
    s.box(196, 20, 324, 44, ["NCCL proxy thread on the CPU"], { tone: "orange", size: 12 });
    s.text(358, 82, "polls GPU buffers, posts RDMA work, polls completions", {
        anchor: "middle",
        size: 11,
        tone: "muted",
    });
    s.arrow(236, 64, 236, 116, { tone: "orange", dashed: true, width: 1.3 });
    s.arrow(480, 64, 480, 116, { tone: "orange", dashed: true, width: 1.3 });
    s.text(208, 188, "GPU writes → RDMA", { anchor: "middle", size: 11, tone: "muted" });
    s.text(502, 188, "RDMA → GPU memory", { anchor: "middle", size: 11, tone: "muted" });
    s.brace(12, 286, 216, "host side + software: most of the fixed cost", "orange");
    s.brace(306, 384, 216, "a small slice", "muted");
    s.brace(404, 708, 216, "host side + software", "orange");
    return (
        <Canvas w={W} h={250} title="The path of one hop between boxes and where its fixed cost sits">
            {s.els}
        </Canvas>
    );
}

export function TwoNics() {
    const s = new Sketch("nics");
    for (const [i, bx] of [16, 372].entries()) {
        s.rect(bx, 16, 332, 170, { tone: "muted", rough: 0.6 });
        s.text(bx + 12, 36, `box ${"AB"[i]}`, { weight: 600 });
        gpus(s, bx + 14, 50, 8, 28, 11, "blue", i * 8);
        for (let g = 0; g < 7; g++) {
            const gx = bx + 14 + g * 39;
            s.arrow(gx + 29, 64, gx + 38, 64, { tone: "blue", width: 1.3 });
        }
        for (let n = 0; n < 4; n++) {
            const nx = bx + 22 + n * 78;
            const used = n === 0 || n === 3;
            s.box(nx, 130, 56, 28, ["NIC"], {
                tone: used ? "green" : "faint",
                fill: used ? undefined : "none",
                dashed: !used,
                size: 11,
            });
        }
    }
    // box A → box B: GPU 7 down to its NIC, across to box B's first NIC, up to GPU 8
    s.arrow(317, 80, 317, 128, { tone: "orange", width: 2 });
    s.arrow(330, 144, 392, 144, { tone: "orange", width: 2 });
    s.arrow(422, 128, 404, 80, { tone: "orange", width: 2 });
    // box B → box A: GPU 15 down to its NIC, back along the bottom, up to GPU 0
    s.arrow(673, 80, 673, 128, { tone: "orange", width: 2 });
    s.route(
        [
            [656, 160],
            [656, 206],
            [66, 206],
            [66, 162],
        ],
        { tone: "orange", width: 2 }
    );
    s.arrow(60, 128, 46, 80, { tone: "orange", width: 2 });
    s.text(360, 228, "the ring leaves and enters each box once: two NICs per box ever see ring traffic", {
        anchor: "middle",
        size: 12,
        tone: "orange",
        weight: 600,
    });
    return (
        <Canvas w={W} h={240} title="A 16-GPU ring crosses between the boxes at exactly two points">
            {s.els}
        </Canvas>
    );
}

// ─── Part 2 ──────────────────────────────────────────────────────────────────

export function Protocols() {
    const s = new Sketch("protos");
    const x0 = 110;
    const sc = 4.2; // px per byte, one 128-byte window
    const rows: [string, string, string, Tone][] = [
        ["LL", "8 data + 8 flag, every 16 bytes", "50% data", "blue"],
        ["LL128", "120 data + 8 flag, every 128 bytes", "~94% data", "green"],
        ["Simple", "full payload, flag sent separately", "~100% data", "purple"],
    ];
    rows.forEach(([name, desc, eff, t], i) => {
        const y = 40 + i * 78;
        s.text(20, y + 22, name, { size: 15, weight: 700, tone: t });
        s.text(x0, y - 8, desc, { size: 11, tone: "muted" });
        const flag = (x: number, w: number) =>
            s.rect(x, y, w, 32, { tone: "orange", fill: wash("orange", 35), rough: 0.5, width: 1.2 });
        const data = (x: number, w: number) =>
            s.rect(x, y, w, 32, { tone: t, fill: wash(t, 45), rough: 0.5, width: 1.2 });
        if (name === "LL") {
            for (let k = 0; k < 8; k++) {
                data(x0 + k * 16 * sc, 8 * sc - 2);
                flag(x0 + (k * 16 + 8) * sc, 8 * sc - 2);
            }
        } else if (name === "LL128") {
            data(x0, 120 * sc - 2);
            flag(x0 + 120 * sc, 8 * sc - 2);
        } else {
            data(x0, 128 * sc - 2);
            flag(x0 + 128 * sc + 12, 22);
        }
        s.text(x0 + 128 * sc, y - 8, eff, { anchor: "end", size: 12, weight: 600 });
    });
    s.text(x0, 276, "← one 128-byte window on the wire →", { size: 11, tone: "muted", mono: true });
    s.rect(470, 265, 12, 12, { tone: "orange", fill: wash("orange", 35), rough: 0.4, width: 1 });
    s.text(488, 276, "flag: what the receiver polls", { size: 11, tone: "muted" });
    return (
        <Canvas w={W} h={288} title="What LL, LL128 and Simple put on the wire">
            {s.els}
        </Canvas>
    );
}

export function RingVsTree() {
    const s = new Sketch("rvt");
    // ring
    s.text(20, 26, "Ring", { size: 15, weight: 700, tone: "blue" });
    s.text(20, 46, "2(N−1) = 30 steps; every step waits on", { size: 12, tone: "muted" });
    s.text(20, 62, "the slowest link, the Ethernet hop", { size: 12, tone: "muted" });
    const cx = 170;
    const cy = 190;
    const R = 92;
    s.circle(cx, cy, R * 2, { tone: "faint", dashed: true, width: 1 });
    for (let i = 0; i < 16; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 16;
        const t: Tone = i < 8 ? "blue" : "purple";
        s.circle(cx + R * Math.cos(a), cy + R * Math.sin(a), 18, { tone: t, fill: wash(t, 55), rough: 0.5 });
    }
    s.line(cx, cy - R - 20, cx, cy + R + 20, { tone: "orange", dashed: true, width: 2 });
    s.text(cx + 40, cy - R - 8, "box A", { size: 11, tone: "blue", weight: 600 });
    s.text(cx - 40, cy - R - 8, "box B", { size: 11, tone: "purple", weight: 600, anchor: "end" });
    s.text(cx, cy + R + 36, "Ethernet", { size: 11, tone: "orange", weight: 600, anchor: "middle" });
    // tree
    const ox = 380;
    s.text(ox, 26, "Tree", { size: 15, weight: 700, tone: "green" });
    s.text(ox, 46, "a chain inside each box; the slow hop", { size: 12, tone: "muted" });
    s.text(ox, 62, "is crossed once up and once down", { size: 12, tone: "muted" });
    for (const [bi, by] of [110, 262].entries()) {
        const t: Tone = bi === 0 ? "blue" : "purple";
        s.text(ox + 312, by + 4, `box ${"AB"[bi]}`, { size: 11, tone: t, weight: 600 });
        for (let g = 0; g < 8; g++) {
            const x = ox + 10 + g * 40;
            s.circle(x, by, 18, { tone: t, fill: wash(t, 55), rough: 0.5 });
            if (g < 7) s.line(x + 10, by, x + 30, by, { tone: "faint", width: 1.2 });
        }
    }
    s.arrow(ox + 4, 252, ox + 4, 122, { tone: "orange", width: 2 });
    s.arrow(ox + 16, 122, ox + 16, 252, { tone: "orange", width: 2 });
    s.text(ox + 30, 182, "up: reduce", { size: 12, tone: "orange", weight: 600 });
    s.text(ox + 30, 200, "down: broadcast", { size: 12, tone: "orange", weight: 600 });
    return (
        <Canvas w={W} h={314} title="Ring and Tree across two boxes">
            {s.els}
        </Canvas>
    );
}

export function SizeRule() {
    const s = new Sketch("rule");
    const x0 = 120;
    const x1 = 700;
    const X = (f: number) => x0 + f * (x1 - x0);
    s.rect(X(0.3), 20, X(0.75) - X(0.3), 130, { tone: "blue", fill: wash("blue", 10), dashed: true, width: 1 });
    s.text((X(0.3) + X(0.75)) / 2, 168, "where decode messages live", {
        anchor: "middle",
        size: 11,
        tone: "blue",
        weight: 600,
    });
    const rows: [string, [number, number, string, Tone][]][] = [
        [
            "NCCL default",
            [
                [0, 0.12, "Tree/LL", "green"],
                [0.12, 0.78, "Ring/LL, far too long", "blue"],
                [0.78, 1, "Ring/Simple", "purple"],
            ],
        ],
        [
            "size rule",
            [
                [0, 0.34, "Tree/LL", "green"],
                [0.34, 0.78, "Ring/LL128", "orange"],
                [0.78, 1, "Ring/Simple", "purple"],
            ],
        ],
    ];
    rows.forEach(([lab, segs], i) => {
        const y = 38 + i * 58;
        s.text(14, y + 22, lab, { size: 13, weight: 600 });
        for (const [a, b, t, tone] of segs) s.box(X(a) + 2, y, X(b) - X(a) - 4, 34, [t], { tone, size: 11 });
    });
    s.arrow(x0, 190, x1, 190, { width: 1.3, tone: "muted" });
    s.text(x0, 210, "small", { size: 11, tone: "muted" });
    s.text(x1, 210, "large", { size: 11, tone: "muted", anchor: "end" });
    s.text((x0 + x1) / 2, 210, "message size; the boundaries are yours to measure", {
        size: 11,
        tone: "muted",
        anchor: "middle",
    });
    return (
        <Canvas w={W} h={220} title="NCCL's default protocol choice across Ethernet against the size rule">
            {s.els}
        </Canvas>
    );
}

// ─── Part 3 ──────────────────────────────────────────────────────────────────

export function TwoFabrics() {
    const s = new Sketch("fabrics");
    const cols: [string, Tone, string[], string[]][] = [
        [
            "RoCE Ethernet",
            "orange",
            ["Ethernet", "switch"],
            ["GPU → PCIe → NIC", "proxy thread, RDMA", "wire → switch → wire", "NIC → PCIe → GPU"],
        ],
        ["PCIe switch fabric", "green", ["PCIe", "fabric"], ["GPU → PCIe", "→ fabric →", "PCIe → GPU"]],
    ];
    cols.forEach(([title, t, mid, hops], c) => {
        const ox = 12 + c * 360;
        s.text(ox + 120, 22, title, { anchor: "middle", size: 14, weight: 700, tone: t });
        for (const [bi, by] of [40, 222].entries()) {
            s.rect(ox, by, 240, 66, { tone: "muted", rough: 0.6 });
            gpus(s, ox + 12, by + 10, 8, 20, 7, "blue", 0, false);
            s.box(ox + 12, by + 38, 216, 20, [`box ${"AB"[bi]}: PCIe switch`], { tone: "ink", fill: "none", size: 10 });
        }
        s.box(ox + 70, 134, 100, 58, mid, { tone: t, size: 12 });
        s.line(ox + 120, 106, ox + 120, 134, { tone: t, width: 2.2 });
        s.line(ox + 120, 192, ox + 120, 222, { tone: t, width: 2.2 });
        hops.forEach((h, i) => s.text(ox + 254, 140 + i * 16, h, { size: 11, tone: "muted" }));
    });
    s.text(360, 312, "Inside a box the two racks are the same; only the hop through the middle differs.", {
        anchor: "middle",
        size: 12,
        weight: 600,
    });
    return (
        <Canvas w={W} h={322} title="The same boxes joined by Ethernet or by a PCIe switch fabric">
            {s.els}
        </Canvas>
    );
}

export function Layouts() {
    const s = new Sketch("layouts");
    const panels: [string, string, string, Tone][] = [
        ["TP16", "one group, both boxes", "~100 all-reduces per step, each crossing twice", "orange"],
        ["2 × TP8", "two independent servers", "nothing crosses per step", "green"],
        ["PP2 × TP8", "stage 1 in A, stage 2 in B", "one activation hand-off per step", "orange"],
    ];
    panels.forEach(([t, sub, cross, ct], p) => {
        const ox = 8 + p * 240;
        s.text(ox + 110, 22, t, { anchor: "middle", size: 14, weight: 700 });
        s.text(ox + 110, 40, sub, { anchor: "middle", size: 11, tone: "muted" });
        for (const [bi, by] of [56, 160].entries()) {
            s.rect(ox, by, 220, 64, { tone: "muted", rough: 0.6 });
            s.text(ox + 8, by + 15, `box ${"AB"[bi]}`, { size: 10, tone: "muted" });
            const tone: Tone = p === 0 ? "blue" : p === 1 ? (bi ? "green" : "blue") : bi ? "orange" : "purple";
            gpus(s, ox + 10, by + 24, 8, 20, 6.5, tone, 0, false);
        }
        if (p === 0)
            for (let k = 0; k < 5; k++)
                s.line(ox + 26 + k * 42, 124, ox + 26 + k * 42, 156, { tone: "orange", width: 1.8 });
        if (p === 2) s.arrow(ox + 110, 124, ox + 110, 156, { tone: "orange", width: 1.8 });
        const words = cross.split(", ");
        words.forEach((w, i) =>
            s.text(ox + 110, 248 + i * 15, w, { anchor: "middle", size: 11, tone: ct, weight: 600 })
        );
    });
    return (
        <Canvas w={W} h={280} title="TP16, two TP8 replicas, and PP2 by TP8 on two boxes">
            {s.els}
        </Canvas>
    );
}

export function MlaKv() {
    const s = new Sketch("mla");
    const cw = 17;
    const ch = 19;
    const L = 6;
    const T = 8;
    const panels: [string, number, number, Tone, string[]][] = [
        ["TP16", L, T, "blue", [`latent KV for all ${L} layers,`, "copied on every rank"]],
        [
            "PP2 × TP8",
            L / 2,
            2 * T,
            "purple",
            [`latent KV for its own ${L / 2} layers:`, "the same memory holds 2× the tokens"],
        ],
    ];
    panels.forEach(([t, layers, toks, tone, note], p) => {
        const ox = 20 + p * 300;
        s.text(ox, 24, t, { size: 14, weight: 700, tone });
        s.text(ox, 42, "one GPU's KV memory", { size: 11, tone: "muted" });
        for (let li = 0; li < layers; li++)
            for (let ti = 0; ti < toks; ti++)
                s.rect(ox + ti * (cw + 2), 56 + li * (ch + 2), cw, ch, {
                    tone,
                    fill: wash(tone, 40),
                    rough: 0.4,
                    width: 0.9,
                });
        const by = 56 + layers * (ch + 2) + 6;
        s.text(ox, by + 12, `${layers} layers × ${toks === T ? "T" : "2T"} tokens`, {
            size: 11,
            tone: "muted",
            mono: true,
        });
        note.forEach((n, i) => s.text(ox, by + 36 + i * 16, n, { size: 12 }));
    });
    return (
        <Canvas w={W} h={252} title="Why pipeline parallelism grows an MLA KV pool and tensor parallelism does not">
            {s.els}
        </Canvas>
    );
}

// ─── Part 4 ──────────────────────────────────────────────────────────────────

export function KvCap() {
    const s = new Sketch("kvcap");
    for (let p = 0; p < 2; p++) {
        const x0 = 30 + p * 360;
        const x1 = x0 + 320;
        const base = 200;
        const top = 34;
        s.arrow(x0, base, x1 + 6, base, { tone: "muted", width: 1.2 });
        s.arrow(x0, base, x0, top - 8, { tone: "muted", width: 1.2 });
        const cap = x0 + 130;
        s.line(cap, top, cap, base, { tone: "faint", dashed: true, width: 1 });
        s.text(cap, top - 10, "KV-cache cap", { anchor: "middle", size: 11, tone: "muted", weight: 600 });
        s.text((x0 + x1) / 2, base + 22, "concurrency you send →", { anchor: "middle", size: 11, tone: "muted" });
        if (p === 0) {
            const py = base - 82;
            const slope = 82 / 130;
            const sx = x0 + (base - top - 4) / slope;
            s.line(x0, base, cap, py, { tone: "blue", width: 2.2 });
            s.line(cap, py, x1, py, { tone: "blue", width: 2.2 });
            s.line(cap, py, sx, top + 4, { tone: "orange", dashed: true, width: 2 });
            s.text(x1, py + 20, "running", { anchor: "end", size: 12, tone: "blue", weight: 600 });
            s.text(sx - 14, top + 12, "sent", { anchor: "end", size: 12, tone: "orange", weight: 600 });
            s.text(cap + 110, py - 14, "the gap is a queue", { anchor: "middle", size: 11, tone: "orange" });
        } else {
            s.curve(
                [
                    [x0, base],
                    [x0 + 60, base - 90],
                    [cap, base - 128],
                    [x1, base - 134],
                ],
                { tone: "green", width: 2.2 }
            );
            s.curve(
                [
                    [x0, base - 18],
                    [cap, base - 30],
                    [cap + 100, base - 70],
                    [x1, top + 4],
                ],
                { tone: "orange", width: 2.2 }
            );
            s.text(cap + 14, base - 146, "throughput: flat", { size: 12, tone: "green", weight: 600 });
            s.text(cap + 40, base - 14, "latency: climbs", { size: 12, tone: "orange", weight: 600 });
        }
    }
    s.text(30, 254, "max running ≈ KV pool tokens ÷ (input + output tokens per request)", { size: 12, mono: true });
    return (
        <Canvas w={W} h={264} title="What the KV-cache cap does to a concurrency sweep (illustrative)">
            {s.els}
        </Canvas>
    );
}

export function EagerVsGraph() {
    const s = new Sketch("eager");
    ["eager mode", "CUDA graph"].forEach((t, r) => {
        const y = 34 + r * 96;
        s.text(14, y + 21, t, { size: 13, weight: 600 });
        let x = 120;
        for (let k = 0; k < 3; k++) {
            if (r === 0) x += 14;
            s.box(x, y, 74, 32, ["compute"], { tone: "blue", size: 11 });
            x += 78;
            if (r === 0) {
                s.box(x, y, 34, 32, ["spin"], { tone: "orange", size: 10, dashed: true });
                x += 37;
            }
            s.box(x, y, 64, 32, ["all-reduce"], { tone: "green", size: 10 });
            x += 68;
        }
        s.text(
            120,
            y + 54,
            r === 0
                ? "launch gaps let ranks drift; early ones spin inside the collective, and it gets billed as communication"
                : "replayed back to back: what remains is the collective itself",
            { size: 11, tone: r === 0 ? "orange" : "green" }
        );
    });
    return (
        <Canvas w={W} h={206} title="Eager mode counts launch gaps as communication; CUDA graphs do not">
            {s.els}
        </Canvas>
    );
}
