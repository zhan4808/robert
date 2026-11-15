"""Explanatory diagrams for the "LLM inference without NVLink" series.

Conceptual drawings and public arithmetic only: no measured latencies,
throughputs, speedups or thresholds. Writes SVGs to public/nvlink-series/diagrams/.

    python3 scripts/diagrams/nvlink.py
"""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / "public" / "nvlink-series" / "diagrams"

# Same palette as the matplotlib figures in the series.
BG = "#fcfbf8"
INK = "#26282b"
MUTED = "#6b6f76"
FAINT = "#a7abb2"
LINE = "#d9d6cf"
TILE = "#efede8"
BLUE = "#2b78d6"
BLUE_L = "#d6e6f8"
GREEN = "#19a974"
GREEN_L = "#d3f0e4"
ORANGE = "#e8673a"
ORANGE_L = "#fbe0d5"
PURPLE = "#6b55d6"
PURPLE_L = "#e2ddf8"
NAVY = "#17345e"

FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
MONO = "'Geist Mono', 'SF Mono', Menlo, Consolas, monospace"


class Svg:
    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.parts: list[str] = []

    def add(self, s: str) -> "Svg":
        self.parts.append(s)
        return self

    def rect(self, x, y, w, h, fill=TILE, stroke="none", sw=1.5, r=6, opacity=1.0, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        return self.add(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{opacity}"{d}/>'
        )

    def text(self, x, y, s, size=17, fill=INK, anchor="start", weight=400, mono=False, italic=False):
        fam = MONO if mono else FONT
        st = ' font-style="italic"' if italic else ""
        s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        return self.add(
            f'<text x="{x:.1f}" y="{y:.1f}" font-family="{fam}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" font-weight="{weight}"{st}>{s}</text>'
        )

    def lines(self, x, y, rows, size=16, fill=MUTED, anchor="start", gap=1.35, weight=400):
        for i, r in enumerate(rows):
            self.text(x, y + i * size * gap, r, size=size, fill=fill, anchor=anchor, weight=weight)
        return self

    def line(self, x1, y1, x2, y2, stroke=INK, sw=2, dash=None, arrow=False, color_id=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        m = f' marker-end="url(#a-{color_id or _cid(stroke)})"' if arrow else ""
        return self.add(
            f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linecap="round"{d}{m}/>'
        )

    def path(self, d, stroke=INK, sw=2, fill="none", dash=None, arrow=False):
        da = f' stroke-dasharray="{dash}"' if dash else ""
        m = f' marker-end="url(#a-{_cid(stroke)})"' if arrow else ""
        return self.add(
            f'<path d="{d}" stroke="{stroke}" stroke-width="{sw}" fill="{fill}" '
            f'stroke-linecap="round" stroke-linejoin="round"{da}{m}/>'
        )

    def circle(self, x, y, r, fill=INK, stroke="none", sw=1.5):
        return self.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

    def gpu(self, x, y, w=46, h=34, label="", fill=BLUE, text_fill="#fff", size=13):
        self.rect(x, y, w, h, fill=fill, r=5)
        if label:
            self.text(x + w / 2, y + h / 2 + size * 0.36, label, size=size, fill=text_fill, anchor="middle", weight=600)
        return self

    def pill(self, x, y, s, fill=TILE, ink=INK, size=14, pad=10, h=26, weight=500):
        w = len(s) * size * 0.56 + pad * 2
        self.rect(x, y, w, h, fill=fill, r=h / 2)
        self.text(x + w / 2, y + h / 2 + size * 0.36, s, size=size, fill=ink, anchor="middle", weight=weight)
        return w

    def save(self, name: str):
        colors = [INK, MUTED, FAINT, BLUE, GREEN, ORANGE, PURPLE, NAVY]
        markers = "".join(
            f'<marker id="a-{_cid(c)}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c}"/></marker>'
            for c in colors
        )
        body = "\n".join(self.parts)
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" '
            f'width="{self.w}" height="{self.h}">\n<defs>{markers}</defs>\n'
            f'<rect width="{self.w}" height="{self.h}" fill="{BG}"/>\n{body}\n</svg>\n'
        )
        OUT.mkdir(parents=True, exist_ok=True)
        (OUT / f"{name}.svg").write_text(svg)
        print("wrote", name)


def _cid(c: str) -> str:
    return c.lstrip("#")


def box_label(s: Svg, x, y, w, title, sub=None):
    s.text(x + 14, y + 26, title, size=16, fill=INK, weight=600)
    if sub:
        s.text(x + w - 14, y + 26, sub, size=13, fill=MUTED, anchor="end")


# ─── Part 1 ──────────────────────────────────────────────────────────────────


def rig():
    """Two 8-GPU PCIe boxes joined by RoCE through one Ethernet switch."""
    s = Svg(960, 400)
    for bi, bx in enumerate((30, 560)):
        s.rect(bx, 30, 370, 300, fill="#fff", stroke=LINE, r=12)
        box_label(s, bx, 30, 370, f"Box {'AB'[bi]}", "8 GPUs, no NVLink")
        for g in range(8):
            gx = bx + 22 + g * 42
            s.gpu(gx, 78, 36, 44, f"{g + 8 * bi}", size=13)
        s.rect(bx + 22, 165, 326, 40, fill=NAVY, r=6)
        s.text(bx + 185, 191, "PCIe switch", size=15, fill="#fff", anchor="middle", weight=600)
        for g in range(8):
            gx = bx + 40 + g * 42
            s.line(gx, 122, gx, 165, stroke=FAINT, sw=2)
        for n in range(4):
            nx = bx + 40 + n * 80
            s.line(nx + 26, 205, nx + 26, 240, stroke=FAINT, sw=2)
            s.rect(nx, 240, 52, 32, fill=GREEN, r=5)
            s.text(nx + 26, 261, "NIC", size=13, fill="#fff", anchor="middle", weight=600)
        s.text(bx + 185, 300, "every GPU-to-GPU byte inside the box crosses PCIe", size=13, fill=MUTED, anchor="middle")
    s.rect(420, 228, 120, 56, fill=ORANGE, r=8)
    s.text(480, 252, "Ethernet", size=15, fill="#fff", anchor="middle", weight=600)
    s.text(480, 271, "switch", size=15, fill="#fff", anchor="middle", weight=600)
    for nx in (30 + 40 + 3 * 80 + 52, 560 + 40):
        pass
    s.path("M 362 256 L 420 256", stroke=ORANGE, sw=3)
    s.path("M 540 256 L 600 256", stroke=ORANGE, sw=3)
    s.text(480, 365, "400G RoCE Ethernet between the boxes: tensor-parallel groups larger than 8 must cross it", size=14, fill=INK, anchor="middle")
    s.save("p1-rig")


def tp_layer():
    """Megatron-style tensor parallelism in one block: column split, row split, all-reduce."""
    s = Svg(960, 430)
    s.text(30, 36, "One block (attention or MLP), split across 4 GPUs", size=16, weight=600)
    s.rect(30, 170, 80, 90, fill=TILE, r=8)
    s.text(70, 210, "x", size=22, anchor="middle", weight=600, italic=True)
    s.text(70, 238, "same input", size=12, fill=MUTED, anchor="middle")
    s.text(70, 252, "on every GPU", size=12, fill=MUTED, anchor="middle")
    cols = [BLUE, GREEN, ORANGE, PURPLE]
    for i in range(4):
        y = 70 + i * 82
        s.line(110, 215, 170, y + 30, stroke=FAINT, sw=1.6)
        s.text(176, y + 4, f"GPU {i}", size=12, fill=cols[i], weight=600)
        s.rect(170, y + 10, 120, 40, fill=cols[i], r=6, opacity=0.9)
        s.text(230, y + 35, f"× W₁ slice {i}", size=14, fill="#fff", anchor="middle", weight=600)
        s.line(290, y + 30, 330, y + 30, stroke=FAINT, sw=1.6, arrow=True, color_id=_cid(FAINT))
        s.rect(335, y + 10, 120, 40, fill=cols[i], r=6, opacity=0.9)
        s.text(395, y + 35, f"× W₂ slice {i}", size=14, fill="#fff", anchor="middle", weight=600)
        s.line(455, y + 30, 500, y + 30, stroke=FAINT, sw=1.6, arrow=True, color_id=_cid(FAINT))
        s.rect(505, y + 12, 80, 36, fill="#fff", stroke=cols[i], sw=2, r=6)
        s.text(545, y + 36, f"y{'₀₁₂₃'[i]}", size=16, anchor="middle", weight=600, italic=True)
        s.line(585, y + 30, 640, 215, stroke=cols[i], sw=2)
    s.text(545, 418, "partial results", size=13, fill=MUTED, anchor="middle")
    s.circle(668, 215, 30, fill=NAVY)
    s.text(668, 225, "Σ", size=28, fill="#fff", anchor="middle", weight=600)
    s.text(668, 268, "all-reduce", size=15, fill=NAVY, anchor="middle", weight=700)
    s.text(668, 286, "(sum across GPUs)", size=12, fill=MUTED, anchor="middle")
    s.line(700, 215, 760, 215, stroke=NAVY, sw=2.5, arrow=True, color_id=_cid(NAVY))
    s.rect(765, 170, 165, 90, fill=TILE, r=8)
    s.text(847, 208, "y = y₀+y₁+y₂+y₃", size=15, anchor="middle", weight=600, italic=True)
    s.text(847, 232, "full output, on every", size=12, fill=MUTED, anchor="middle")
    s.text(847, 246, "GPU, before the next block", size=12, fill=MUTED, anchor="middle")
    s.text(230, 418, "W₁ split by columns", size=13, fill=MUTED, anchor="middle")
    s.text(395, 418, "W₂ split by rows", size=13, fill=MUTED, anchor="middle")
    s.text(847, 300, "Twice per layer, every layer,", size=13, fill=INK, anchor="middle", weight=600)
    s.text(847, 318, "every decode step.", size=13, fill=INK, anchor="middle", weight=600)
    s.save("p1-tp-layer")


def ring_allreduce():
    """Ring all-reduce on 4 GPUs: 3 reduce-scatter steps, then 3 all-gather steps."""
    n = 4
    state = [[{g} for _ in range(n)] for g in range(n)]
    snaps = [("start", [[set(c) for c in r] for r in state], set())]
    for st in range(n - 1):
        new = [[set(c) for c in r] for r in state]
        moved = set()
        for g in range(n):
            c = (g - st) % n
            r = (g + 1) % n
            new[r][c] |= state[g][c]
            moved.add((r, c))
        state = new
        snaps.append((f"reduce-scatter {st + 1}", [[set(c) for c in r] for r in state], moved))
    for st in range(n - 1):
        new = [[set(c) for c in r] for r in state]
        moved = set()
        for g in range(n):
            c = (g + 1 - st) % n
            r = (g + 1) % n
            new[r][c] = set(state[g][c])
            moved.add((r, c))
        state = new
        snaps.append((f"all-gather {st + 1}", [[set(c) for c in r] for r in state], moved))

    s = Svg(1000, 330)
    cell = 24
    shades = {1: "#e6eef9", 2: "#a9c8ef", 3: "#5f9be3", 4: NAVY}
    for k, (title, grid, moved) in enumerate(snaps):
        px = 30 + k * 138
        py = 70
        phase = ORANGE if "reduce" in title else GREEN if "gather" in title else MUTED
        s.text(px + 2 * cell + 8, 48, title, size=13, fill=phase, anchor="middle", weight=600)
        for g in range(n):
            if k == 0:
                pass
            for c in range(n):
                cnt = len(grid[g][c])
                x = px + 16 + c * cell
                y = py + g * cell
                s.rect(x, y, cell - 3, cell - 3, fill=shades[cnt], r=3,
                       stroke=ORANGE if (g, c) in moved else "none", sw=2.2)
        for g in range(n):
            s.text(px + 8, py + g * cell + 16, f"{g}", size=11, fill=MUTED, anchor="middle")
        for c in range(n):
            s.text(px + 16 + c * cell + 10, py + n * cell + 14, "abcd"[c], size=11, fill=MUTED, anchor="middle")
        if k < len(snaps) - 1:
            s.line(px + 122, py + 48, px + 134, py + 48, stroke=FAINT, sw=1.6, arrow=True, color_id=_cid(FAINT))
    s.text(30, 225, "rows: GPU 0–3   columns: message chunks a–d", size=13, fill=MUTED)
    lx = 30
    for cnt in (1, 2, 3, 4):
        s.rect(lx, 245, 18, 18, fill=shades[cnt], r=3)
        s.text(lx + 26, 259, f"sum of {cnt} GPU{'s' if cnt > 1 else ''}" + (" (done)" if cnt == 4 else ""), size=13, fill=INK)
        lx += 150
    s.rect(lx + 10, 245, 18, 18, fill="#fff", stroke=ORANGE, sw=2.2, r=3)
    s.text(lx + 36, 259, "just received", size=13, fill=INK)
    s.text(30, 300, "N−1 steps to reduce, N−1 steps to share: 2(N−1) steps. Each GPU sends one chunk per step, 2(N−1)/N of the message in total.",
           size=14, fill=INK)
    s.save("p1-ring-allreduce")


def alpha_beta():
    """Same ring, two message sizes: startup blocks vs transfer bars."""
    s = Svg(960, 300)
    steps = 6
    rows = [("decode message (KBs)", 4), ("prefill message (tens of MB)", 70)]
    for ri, (label, tw) in enumerate(rows):
        y = 60 + ri * 100
        s.text(30, y - 12, label, size=15, weight=600)
        x = 30
        for k in range(steps):
            s.rect(x, y, 40, 34, fill=ORANGE, r=4)
            x += 40
            s.rect(x + 1, y, tw, 34, fill=BLUE, r=4)
            x += tw + 6
        if ri == 0:
            s.text(x + 8, y + 23, "time →", size=13, fill=MUTED)
    s.rect(30, 262, 18, 18, fill=ORANGE, r=3)
    s.text(56, 276, "α: fixed cost per ring step (launch, signal, wait for flag)", size=13)
    s.rect(500, 262, 18, 18, fill=BLUE, r=3)
    s.text(526, 276, "n/B per step: moving one chunk", size=13)
    s.text(930, 82, "startup dominates", size=14, fill=ORANGE, anchor="end", weight=700)
    s.text(930, 182, "transfer dominates", size=14, fill=BLUE, anchor="end", weight=700)
    s.save("p1-alpha-beta")


def message_sizes():
    """Log ruler of all-reduce sizes for hidden 4096, bf16."""
    s = Svg(960, 270)
    x0, x1 = 60, 900
    lo, hi = math.log2(1024), math.log2(256 * 1024 * 1024)

    def X(b):
        return x0 + (math.log2(b) - lo) / (hi - lo) * (x1 - x0)

    y = 150
    s.rect(X(8 * 1024), y - 26, X(4 * 1024 * 1024) - X(8 * 1024), 52, fill=BLUE_L, r=6)
    s.text((X(8 * 1024) + X(4 * 1024 * 1024)) / 2, y + 44, "decode: 1 → 512 requests in flight", size=13, fill=BLUE, anchor="middle", weight=600)
    s.line(x0, y, x1, y, stroke=INK, sw=2)
    for b, lab in [(1024, "1 KiB"), (32 * 1024, "32 KiB"), (1024**2, "1 MiB"), (32 * 1024**2, "32 MiB"), (256 * 1024**2, "256 MiB")]:
        s.line(X(b), y - 6, X(b), y + 6, stroke=INK, sw=2)
        s.text(X(b), y + 70, lab, size=13, fill=MUTED, anchor="middle", mono=True)
    marks = [
        (8 * 1024, "1 request", "8 KiB", BLUE),
        (512 * 1024, "64 requests", "512 KiB", BLUE),
        (4 * 1024**2, "512 requests", "4 MiB", BLUE),
        (64 * 1024**2, "8,192-token prefill chunk", "64 MiB", ORANGE),
    ]
    for b, a, v, c in marks:
        s.circle(X(b), y, 7, fill=c, stroke="#fff", sw=2)
        s.line(X(b), y - 10, X(b), y - 48, stroke=c, sw=1.5)
        s.text(X(b), y - 72, a, size=13, fill=INK, anchor="middle", weight=600)
        s.text(X(b), y - 54, v, size=13, fill=c, anchor="middle", mono=True)
    s.text(x0, 30, "message bytes = tokens in step × 4096 hidden × 2 bytes (bf16)", size=14, fill=MUTED, mono=True)
    s.save("p1-message-sizes")


def decomposition():
    """How each of the three terms is measured."""
    s = Svg(960, 300)
    s.text(30, 36, "One all-reduce from a real decode step", size=16, weight=600)
    y = 70
    s.rect(30, y, 300, 50, fill=ORANGE, r=6)
    s.rect(330, y, 330, 50, fill=GREEN, r=6)
    s.rect(660, y, 130, 50, fill="#f39c79", r=6)
    s.text(180, y + 31, "startup", size=16, fill="#fff", anchor="middle", weight=600)
    s.text(495, y + 31, "transfer", size=16, fill="#fff", anchor="middle", weight=600)
    s.text(725, y + 31, "residual", size=16, fill="#fff", anchor="middle", weight=600)
    s.path(f"M 30 {y + 62} L 30 {y + 72} L 790 {y + 72} L 790 {y + 62}", stroke=INK, sw=1.6)
    s.text(410, y + 94, "kernel time measured inside vLLM (CUDA graph)", size=13, fill=INK, anchor="middle")
    for cx, c in ((180, ORANGE), (495, GREEN), (725, "#d9572a")):
        s.line(cx, y + 104, cx, y + 136, stroke=c, sw=1.6, dash="4 4")
    blocks = [
        (30, 300, ORANGE, "Isolated benchmark at 256 bytes", ["same algorithm + protocol", "NCCL picked in the run"]),
        (330, 330, GREEN, "Isolated benchmark at this size", ["minus the startup term"]),
        (660, 270, "#d9572a", "Whatever is left", ["late peers, wake-ups,", "anything the benchmark misses"]),
    ]
    for x, w, c, t, sub in blocks:
        s.text(x + 4, y + 165, t, size=14, fill=c, weight=700)
        s.lines(x + 4, y + 187, sub, size=13, fill=MUTED)
    s.save("p1-decomposition")


def eth_crossing():
    """Path of one cross-box hop and where the fixed cost sits."""
    s = Svg(980, 330)
    stages = [
        ("GPU", BLUE, "writes data"),
        ("PCIe switch", NAVY, ""),
        ("NIC (PCIe side)", ORANGE, "GPU writes → RDMA"),
        ("wire + switch", FAINT, ""),
        ("NIC (PCIe side)", ORANGE, "RDMA → GPU memory"),
        ("PCIe switch", NAVY, ""),
        ("GPU", BLUE, "sees the flag"),
    ]
    x = 14
    w = 120
    y = 150
    for i, (t, c, sub) in enumerate(stages):
        s.rect(x, y, w, 52, fill=c, r=7)
        for j, part in enumerate(t.split(" (")):
            lab = part if j == 0 else "(" + part
            s.text(x + w / 2, y + 23 + j * 17, lab, size=13 if j else 14, fill="#fff", anchor="middle", weight=600)
        if sub:
            s.text(x + w / 2, y + 74, sub, size=12, fill=MUTED, anchor="middle")
        if i < len(stages) - 1:
            s.line(x + w + 2, y + 26, x + w + 14, y + 26, stroke=INK, sw=1.8, arrow=True)
        x += w + 16
    s.rect(300, 34, 380, 52, fill=ORANGE_L, stroke=ORANGE, r=8)
    s.text(490, 58, "NCCL proxy thread (CPU)", size=14, fill=ORANGE, anchor="middle", weight=700)
    s.text(490, 76, "polls GPU buffers, posts RDMA work, polls completions", size=12, fill=INK, anchor="middle")
    s.path("M 340 86 Q 340 120 335 148", stroke=ORANGE, sw=1.8, dash="5 4", arrow=True)
    s.path("M 640 86 Q 640 120 647 148", stroke=ORANGE, sw=1.8, dash="5 4", arrow=True)
    s.path("M 20 262 L 20 272 L 418 272 L 418 262", stroke=ORANGE, sw=2)
    s.path("M 560 262 L 560 272 L 958 272 L 958 262", stroke=ORANGE, sw=2)
    s.path("M 428 262 L 428 272 L 550 272 L 550 262", stroke=FAINT, sw=2)
    s.text(219, 296, "host-side hops + software: most of the fixed cost", size=13, fill=ORANGE, anchor="middle", weight=600)
    s.text(759, 296, "host-side hops + software", size=13, fill=ORANGE, anchor="middle", weight=600)
    s.text(489, 296, "a small slice", size=13, fill=MUTED, anchor="middle", weight=600)
    s.save("p1-eth-crossing")


def two_nics():
    """A 16-GPU ring crosses between the boxes at exactly two points."""
    s = Svg(960, 330)
    for bi, bx in enumerate((30, 500)):
        s.rect(bx, 40, 430, 230, fill="#fff", stroke=LINE, r=12)
        box_label(s, bx, 40, 430, f"Box {'AB'[bi]}")
        for g in range(8):
            gx = bx + 20 + g * 50
            s.gpu(gx, 80, 40, 34, f"{g + 8 * bi}", size=13)
            if g < 7:
                s.line(gx + 41, 97, gx + 49, 97, stroke=BLUE, sw=2.5, arrow=True, color_id=_cid(BLUE))
        for n in range(4):
            nx = bx + 30 + n * 100
            active = (bi == 0 and n in (0, 3)) or (bi == 1 and n in (0, 3))
            s.rect(nx, 190, 64, 34, fill=GREEN if active else TILE, r=5)
            s.text(nx + 32, 212, "NIC", size=13, fill="#fff" if active else FAINT, anchor="middle", weight=600)
        s.text(bx + 215, 255, "two NICs can carry ring traffic; the rest sit idle", size=12, fill=MUTED, anchor="middle")
    # crossings: GPU7 -> B, GPU15 -> A
    s.path("M 410 114 L 410 160 L 392 160 L 392 190", stroke=ORANGE, sw=2.5)
    s.path("M 424 207 L 470 207 L 470 140 L 530 140 L 530 190", stroke=ORANGE, sw=2.5, arrow=True)
    s.path("M 530 190 L 530 160 L 540 160 L 540 114", stroke=ORANGE, sw=2.5, arrow=True)
    s.path("M 880 114 L 880 168 L 862 168 L 862 190", stroke=ORANGE, sw=2.5)
    s.path("M 894 224 L 894 300 L 60 300 L 60 224", stroke=ORANGE, sw=2.5, arrow=True)
    s.path("M 60 190 L 60 150 L 50 150 L 50 114", stroke=ORANGE, sw=2.5, arrow=True)
    s.text(480, 322, "the ring leaves and enters each box once in each direction", size=13, fill=ORANGE, anchor="middle", weight=600)
    s.save("p1-two-nics")


def scaling_math():
    """Ring steps grow linearly; bytes per GPU saturate at 2x."""
    s = Svg(960, 300)
    data = [(4, 6, 1.5), (8, 14, 1.75), (16, 30, 1.875)]
    # left: ring steps
    s.text(40, 36, "Ring steps per all-reduce: 2(N−1)", size=15, weight=600)
    s.text(520, 36, "Bytes each GPU sends: 2(N−1)/N × message", size=15, weight=600)
    base = 250
    for i, (n, st, b) in enumerate(data):
        x = 70 + i * 130
        h = st / 30 * 170
        s.rect(x, base - h, 70, h, fill=ORANGE, r=5)
        s.text(x + 35, base - h - 10, f"{st}", size=16, anchor="middle", weight=700)
        s.text(x + 35, base + 24, f"TP{n}", size=14, fill=MUTED, anchor="middle")
        x2 = 550 + i * 130
        h2 = b / 2 * 150
        s.rect(x2, base - h2, 70, h2, fill=BLUE, r=5)
        s.text(x2 + 35, base - h2 - 10, f"{b:g}×", size=16, anchor="middle", weight=700)
        s.text(x2 + 35, base + 24, f"TP{n}", size=14, fill=MUTED, anchor="middle")
    s.line(530, base - 150, 930, base - 150, stroke=FAINT, sw=1.5, dash="5 5")
    s.text(534, base - 158, "2× ceiling", size=12, fill=MUTED)
    s.line(40, base, 460, base, stroke=LINE, sw=1.5)
    s.line(530, base, 930, base, stroke=LINE, sw=1.5)
    s.text(250, 290, "latency term: grows with every GPU", size=13, fill=ORANGE, anchor="middle", weight=600)
    s.text(730, 290, "bandwidth term: barely moves", size=13, fill=BLUE, anchor="middle", weight=600)
    s.save("p1-scaling-math")


# ─── Part 2 ──────────────────────────────────────────────────────────────────


def protocols():
    """What each protocol puts on the wire."""
    s = Svg(980, 360)
    rows = [
        ("LL", "every 16 bytes: 8 data + 8 flag", "50% data", BLUE),
        ("LL128", "every 128 bytes: 120 data + 8 flag", "~94% data", GREEN),
        ("Simple", "full payload, then a separate flag", "~100% data", PURPLE),
    ]
    x0, scale = 150, 4.4  # px per byte for a 128-byte window
    for i, (name, desc, eff, c) in enumerate(rows):
        y = 50 + i * 100
        s.text(30, y + 26, name, size=18, weight=700, fill=c)
        s.text(x0, y - 8, desc, size=13, fill=MUTED)
        if name == "LL":
            for k in range(8):
                x = x0 + k * 16 * scale
                s.rect(x, y, 8 * scale - 1, 40, fill=c, r=2)
                s.rect(x + 8 * scale, y, 8 * scale - 2, 40, fill=ORANGE_L, stroke=ORANGE, sw=1, r=2)
        elif name == "LL128":
            s.rect(x0, y, 120 * scale - 1, 40, fill=c, r=3)
            s.rect(x0 + 120 * scale, y, 8 * scale - 2, 40, fill=ORANGE_L, stroke=ORANGE, sw=1, r=2)
        else:
            s.rect(x0, y, 128 * scale - 2, 40, fill=c, r=3)
            s.rect(x0 + 128 * scale + 14, y + 6, 26, 28, fill=ORANGE_L, stroke=ORANGE, sw=1, r=2)
            s.text(x0 + 128 * scale + 27, y + 56, "flag", size=11, fill=ORANGE, anchor="middle")
        s.text(940, y + 26, eff, size=14, anchor="end", weight=600)
    s.text(x0, 340, "← 128 bytes on the wire →", size=12, fill=MUTED, mono=True)
    s.rect(560, 324, 14, 14, fill=ORANGE_L, stroke=ORANGE, sw=1, r=2)
    s.text(582, 336, "flags: receivers poll these instead of a handshake", size=12, fill=MUTED)
    s.save("p2-protocols")


def protocol_tradeoff():
    """Small α / poor B vs large α / good B: who wins by size."""
    s = Svg(900, 330)
    x0, y0, x1, y1 = 80, 280, 860, 40

    def curve(alpha, inv_bw, color, label, lab_at, dy=-10):
        pts = []
        for i in range(0, 101):
            t = i / 100
            n = 10 ** (t * 5)
            v = alpha + n * inv_bw
            pts.append((x0 + t * (x1 - x0), math.log10(v)))
        lo, hi = 0.0, 4.0
        d = " ".join(f"{'M' if k == 0 else 'L'} {px:.1f} {y0 - (min(max(pv, lo), hi) - lo) / (hi - lo) * (y0 - y1):.1f}" for k, (px, pv) in enumerate(pts))
        s.path(d, stroke=color, sw=3)
        px, pv = pts[lab_at]
        s.text(px + 6, y0 - (pv - lo) / (hi - lo) * (y0 - y1) + dy, label, size=14, fill=color, weight=700)

    s.line(x0, y0, x1, y0, stroke=INK, sw=1.5)
    s.line(x0, y0, x0, y1, stroke=INK, sw=1.5)
    curve(3, 0.02, BLUE, "LL: tiny startup, low throughput", 2, dy=22)
    curve(12, 0.0011, GREEN, "LL128: in between", 2, dy=-10)
    curve(40, 0.0006, PURPLE, "Simple: big startup, full throughput", 2, dy=-10)
    s.text((x0 + x1) / 2, y0 + 34, "message size (log) →", size=13, fill=MUTED, anchor="middle")
    s.add(f'<text x="30" y="{(y0 + y1) / 2}" font-family="{FONT}" font-size="13" fill="{MUTED}" text-anchor="middle" transform="rotate(-90 30 {(y0 + y1) / 2})">time per call (log) →</text>')
    s.text(x1, y1 - 10, "illustrative shapes, not measurements", size=12, fill=FAINT, anchor="end", italic=True)
    s.save("p2-protocol-tradeoff")


def ring_vs_tree():
    """Across two boxes: ring steps all gated by the slow hop vs tree's two crossings."""
    s = Svg(980, 380)
    # ring
    s.text(30, 34, "Ring", size=17, weight=700, fill=BLUE)
    s.text(30, 56, "2(N−1) = 30 steps. Every step runs all links at once,", size=13, fill=MUTED)
    s.text(30, 74, "so every step waits on the slowest one: the Ethernet hop.", size=13, fill=MUTED)
    cx, cy, R = 240, 225, 100
    for i in range(16):
        a = -math.pi / 2 + i * 2 * math.pi / 16
        x, y = cx + R * math.cos(a), cy + R * math.sin(a)
        s.circle(x, y, 11, fill=BLUE if i < 8 else PURPLE)
    s.add(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{FAINT}" stroke-width="1.5" stroke-dasharray="4 5"/>')
    s.line(cx, cy - R - 22, cx, cy + R + 22, stroke=ORANGE, sw=3, dash="7 6")
    s.text(cx + 52, cy - R - 10, "box A", size=12, fill=BLUE, weight=600)
    s.text(cx - 92, cy - R - 10, "box B", size=12, fill=PURPLE, weight=600)
    s.text(cx, cy + R + 44, "Ethernet", size=12, fill=ORANGE, anchor="middle", weight=600)
    # tree
    ox = 520
    s.text(ox, 34, "Tree", size=17, weight=700, fill=GREEN)
    s.text(ox, 56, "Chain inside each box; the slow hop is crossed", size=13, fill=MUTED)
    s.text(ox, 74, "once on the way up and once on the way down.", size=13, fill=MUTED)
    for bi, (by, col) in enumerate(((120, BLUE), (270, PURPLE))):
        s.text(ox, by - 12, f"box {'AB'[bi]}", size=12, fill=col, weight=600)
        for g in range(8):
            x = ox + 10 + g * 52
            s.circle(x + 11, by + 14, 11, fill=col)
            if g < 7:
                s.line(x + 24, by + 14, x + 48, by + 14, stroke=FAINT, sw=2)
    s.path(f"M {ox + 21} 145 L {ox + 21} 270", stroke=ORANGE, sw=3.5)
    s.text(ox + 34, 200, "1 crossing up (reduce)", size=13, fill=ORANGE, weight=600)
    s.text(ox + 34, 220, "1 crossing down (broadcast)", size=13, fill=ORANGE, weight=600)
    s.text(ox, 336, "fewer serial crossings → less latency at small sizes", size=13, fill=GREEN, weight=600)
    s.save("p2-ring-vs-tree")


def nccl_decision():
    """How NCCL picks: built-in numbers in, cheapest estimate out."""
    s = Svg(980, 320)
    s.rect(20, 110, 200, 100, fill=TILE, r=10)
    s.lines(120, 140, ["each call:", "collective, size,", "detected link types"], size=14, fill=INK, anchor="middle")
    s.line(220, 160, 270, 160, stroke=INK, sw=2, arrow=True)
    s.rect(270, 40, 290, 240, fill="#fff", stroke=LINE, r=10)
    s.text(415, 68, "estimate every combination", size=15, anchor="middle", weight=700)
    combos = ["Ring / LL", "Ring / LL128", "Ring / Simple", "Tree / LL", "Tree / LL128", "Tree / Simple"]
    for i, cbo in enumerate(combos):
        y = 86 + i * 30
        s.rect(290, y, 250, 24, fill=TILE, r=5)
        s.text(300, y + 17, cbo, size=13, mono=True)
        s.text(530, y + 17, "latency + size/bw", size=11, fill=MUTED, anchor="end")
    s.line(560, 160, 610, 160, stroke=INK, sw=2, arrow=True)
    s.rect(610, 120, 150, 80, fill=NAVY, r=10)
    s.text(685, 156, "pick the", size=15, fill="#fff", anchor="middle", weight=600)
    s.text(685, 176, "cheapest", size=15, fill="#fff", anchor="middle", weight=600)
    s.rect(790, 40, 175, 240, fill=ORANGE_L, stroke=ORANGE, r=10)
    s.lines(877, 72, ["built-in table", "per link type:"], size=14, fill=ORANGE, anchor="middle", weight=700)
    s.lines(877, 124, ["NVLink", "PCIe", "network"], size=13, fill=INK, anchor="middle")
    s.lines(877, 210, ["generic values.", "nothing measures", "your fabric"], size=13, fill=ORANGE, anchor="middle", weight=600)
    s.path("M 790 110 C 700 20, 520 20, 470 82", stroke=ORANGE, sw=2, dash="5 4", arrow=True)
    s.save("p2-nccl-decision")


def size_rule():
    """NCCL's default choice vs the size rule, across Ethernet."""
    s = Svg(980, 300)
    x0, x1 = 170, 940
    s.rect(x0 + 0.30 * (x1 - x0), 40, 0.45 * (x1 - x0), 190, fill=BLUE_L, r=6, opacity=0.6)
    s.text(x0 + 0.525 * (x1 - x0), 222, "decode sizes", size=12, fill=BLUE, anchor="middle", weight=600)
    rows = [
        ("NCCL default", [(0, 0.12, "Tree/LL", GREEN), (0.12, 0.78, "Ring/LL (stays far too long)", BLUE), (0.78, 1, "Ring/Simple", PURPLE)]),
        ("Size rule", [(0, 0.34, "Tree/LL", GREEN), (0.34, 0.78, "Ring/LL128", ORANGE), (0.78, 1, "Ring/Simple", PURPLE)]),
    ]
    for i, (lab, segs) in enumerate(rows):
        y = 70 + i * 80
        s.text(30, y + 27, lab, size=15, weight=700)
        for a, b, t, c in segs:
            xa, xb = x0 + a * (x1 - x0), x0 + b * (x1 - x0)
            s.rect(xa + 1, y, xb - xa - 2, 42, fill=c, r=5)
            s.text((xa + xb) / 2, y + 27, t, size=13, fill="#fff", anchor="middle", weight=600)
    s.line(x0, 250, x1, 250, stroke=INK, sw=1.5, arrow=True)
    s.text(x0, 274, "small", size=13, fill=MUTED)
    s.text(x1, 274, "large", size=13, fill=MUTED, anchor="end")
    s.text((x0 + x1) / 2, 274, "message size (boundaries depend on your fabric)", size=13, fill=MUTED, anchor="middle")
    s.save("p2-size-rule")


def tuner_wiring():
    """Where the tuner plugin and NCCL_PROTO sit."""
    s = Svg(980, 300)
    steps = [
        ("NCCL_PROTO", "which protocols may be used", "allreduce:LL,LL128,Simple", ORANGE),
        ("cost model", "NCCL's own estimate", "", NAVY),
        ("tuner plugin", "reads rules.conf", "overrides algo, proto, channels per size", GREEN),
        ("the call runs", "", "", BLUE),
    ]
    x = 20
    for i, (t, sub, note, c) in enumerate(steps):
        s.rect(x, 100, 200, 70, fill=c, r=10)
        s.text(x + 100, 132, t, size=16, fill="#fff", anchor="middle", weight=700)
        if sub:
            s.text(x + 100, 154, sub, size=12, fill="#fff", anchor="middle")
        if note:
            s.text(x + 100, 196, note, size=11, fill=MUTED, anchor="middle", mono=True)
        if i < 3:
            s.line(x + 202, 135, x + 240, 135, stroke=INK, sw=2, arrow=True)
        x += 245
    s.rect(20, 222, 200, 56, fill=ORANGE_L, r=8)
    s.lines(120, 244, ["LL128 is off on PCIe:", "allow it here first"], size=12, fill=ORANGE, anchor="middle", weight=600)
    s.rect(510, 222, 200, 56, fill=GREEN_L, r=8)
    s.lines(610, 244, ["example plugin bug: no rule", "match → channels = 1. Patch it."], size=12, fill=GREEN, anchor="middle", weight=600)
    s.text(490, 50, "A rule can only choose among protocols the gate on the left allows.", size=14, anchor="middle")
    s.save("p2-tuner-wiring")


# ─── Part 3 ──────────────────────────────────────────────────────────────────


def two_fabrics():
    """Same boxes, two ways to join them."""
    s = Svg(980, 400)
    for col, (title, fabric, fc, hops) in enumerate(
        [
            ("RoCE Ethernet", "Ethernet switch", ORANGE, ["GPU → PCIe → NIC", "proxy thread + RDMA", "wire → switch → wire", "NIC → PCIe → GPU"]),
            ("PCIe switch fabric", "PCIe fabric", GREEN, ["GPU → PCIe", "fabric", "PCIe → GPU", ""]),
        ]
    ):
        ox = 20 + col * 490
        s.text(ox + 220, 32, title, size=17, fill=fc, anchor="middle", weight=700)
        for bi, by in enumerate((60, 250)):
            s.rect(ox, by, 440, 90, fill="#fff", stroke=LINE, r=10)
            for g in range(8):
                s.gpu(ox + 16 + g * 52, by + 14, 42, 28, "", size=11)
            s.rect(ox + 16, by + 52, 408, 26, fill=NAVY, r=5)
            s.text(ox + 220, by + 70, f"box {'AB'[bi]}: PCIe switch", size=12, fill="#fff", anchor="middle", weight=600)
        s.rect(ox + 140, 168, 160, 64, fill=fc, r=10)
        s.text(ox + 220, 206, fabric, size=14, fill="#fff", anchor="middle", weight=700)
        s.line(ox + 220, 150, ox + 220, 168, stroke=fc, sw=3)
        s.line(ox + 220, 232, ox + 220, 250, stroke=fc, sw=3)
        s.lines(ox + 320, 180, [h for h in hops if h], size=11, fill=MUTED)
    s.text(490, 380, "Inside each box the two are identical. Only the hop through the middle differs.", size=14, anchor="middle", weight=600)
    s.save("p3-two-fabrics")


def layouts():
    """TP16, two TP8 replicas, PP2 x TP8."""
    s = Svg(980, 360)
    panels = [
        ("TP16", "one group spans both boxes", "every all-reduce crosses: ~100 per step, twice each"),
        ("2 × TP8 replicas", "two independent servers", "nothing crosses per step"),
        ("PP2 × TP8", "stage 1 in box A, stage 2 in box B", "one activation hand-off per step"),
    ]
    for p, (t, sub, cross) in enumerate(panels):
        ox = 20 + p * 325
        s.text(ox + 150, 32, t, size=17, anchor="middle", weight=700)
        s.text(ox + 150, 52, sub, size=12, fill=MUTED, anchor="middle")
        for bi, by in enumerate((80, 200)):
            s.rect(ox, by, 300, 80, fill="#fff", stroke=LINE, r=10)
            s.text(ox + 10, by + 18, f"box {'AB'[bi]}", size=11, fill=MUTED)
            for g in range(8):
                if p == 0:
                    c = BLUE
                elif p == 1:
                    c = BLUE if bi == 0 else GREEN
                else:
                    c = PURPLE if bi == 0 else ORANGE
                s.gpu(ox + 12 + g * 36, by + 30, 30, 36, "", fill=c)
        if p == 0:
            for k in range(5):
                x = ox + 40 + k * 55
                s.line(x, 166, x, 196, stroke=ORANGE, sw=2.5)
        elif p == 2:
            s.line(ox + 150, 166, ox + 150, 196, stroke=ORANGE, sw=2.5, arrow=True)
        s.text(ox + 150, 312, cross, size=12, fill=ORANGE if p != 1 else GREEN, anchor="middle", weight=600)
    s.save("p3-layouts")


def mla_kv():
    """Why TP doesn't grow an MLA KV pool and PP does."""
    s = Svg(980, 380)
    s.text(30, 32, "What one GPU's KV memory holds (same size in both cases)", size=16, weight=600)
    L, T = 8, 10
    for p, (t, layers, toks, c, note) in enumerate(
        [
            ("TP16", L, T, BLUE, ["latent KV for all layers,", "copied on every TP rank"]),
            ("PP2 × TP8", L // 2, 2 * T, PURPLE, ["latent KV for its own layers only:", "the same memory holds 2× the tokens"]),
        ]
    ):
        ox = 40 + p * 470
        s.text(ox, 72, t, size=17, fill=c, weight=700)
        cw, ch = 18, 22
        for li in range(layers):
            for ti in range(toks):
                s.rect(ox + ti * (cw + 2), 90 + li * (ch + 2), cw, ch, fill=c, r=2, opacity=0.85)
        s.text(ox, 90 + layers * (ch + 2) + 22, f"{layers} layers × {'T' if toks == T else '2T'} tokens", size=13, fill=MUTED, mono=True)
        s.lines(ox, 90 + L * (ch + 2) + 52, note, size=13, fill=INK)
    s.text(30, 92 + L * 24 - 4, "", size=1)
    s.save("p3-mla-kv")


def decision_tree():
    """The decision guide as a flowchart."""
    s = Svg(980, 400)

    def node(x, y, w, h, t, fill=TILE, ink=INK, size=14, weight=600):
        s.rect(x, y, w, h, fill=fill, r=10)
        rows = t.split("\n")
        for i, r in enumerate(rows):
            s.text(x + w / 2, y + h / 2 + (i - (len(rows) - 1) / 2) * 18 + 5, r, size=size, fill=ink, anchor="middle", weight=weight)

    node(360, 20, 260, 50, "16 GPUs in two boxes", fill=NAVY, ink="#fff")
    s.line(490, 70, 490, 100, stroke=INK, sw=2, arrow=True)
    node(330, 100, 320, 50, "Long-context MLA model?")
    s.line(650, 125, 730, 125, stroke=INK, sw=2, arrow=True)
    s.text(690, 116, "yes", size=12, fill=MUTED, anchor="middle")
    node(730, 95, 230, 60, "grow KV with PP first\n(PP2 × TP8)", fill=PURPLE, ink="#fff", size=13)
    s.line(490, 150, 490, 180, stroke=INK, sw=2, arrow=True)
    s.text(504, 170, "no", size=12, fill=MUTED)
    node(330, 180, 320, 50, "Prefill-heavy batch work?")
    s.line(650, 205, 730, 205, stroke=INK, sw=2, arrow=True)
    s.text(690, 196, "yes", size=12, fill=MUTED, anchor="middle")
    node(730, 180, 230, 50, "either fabric", fill=TILE, size=13)
    s.line(490, 230, 490, 260, stroke=INK, sw=2, arrow=True)
    s.text(504, 250, "no", size=12, fill=MUTED)
    node(330, 260, 320, 50, "Which fabric joins the boxes?")
    s.path("M 400 310 L 400 330 L 200 330 L 200 345", stroke=INK, sw=2, arrow=True)
    s.path("M 580 310 L 580 330 L 780 330 L 780 345", stroke=INK, sw=2, arrow=True)
    node(60, 345, 280, 50, "Ethernet: TP inside a box,\nreplicas + tuned NCCL rule", fill=ORANGE, ink="#fff", size=13)
    node(640, 345, 280, 50, "PCIe fabric: one TP16 group\nfor latency-sensitive decode", fill=GREEN, ink="#fff", size=13)
    s.save("p3-decision")


# ─── Part 4 ──────────────────────────────────────────────────────────────────


def step_timeline():
    """A serving session: steady decode steps with prefill bursts."""
    s = Svg(980, 300)
    x0, x1, base, top = 70, 950, 240, 40
    s.line(x0, base, x1, base, stroke=INK, sw=1.5)
    s.line(x0, base, x0, top, stroke=INK, sw=1.5)
    import random

    random.seed(3)
    x = x0 + 6
    running = 4
    k = 0
    while x < x1 - 12:
        kind = "decode"
        if k in (6, 22, 23, 41, 57):
            kind = "prefill"
        elif k in (15, 33, 48):
            kind = "mixed"
        if kind == "decode":
            running = min(running + random.choice([0, 0, 1]), 40)
            h = 28 + running * 1.6
            c = BLUE
        elif kind == "prefill":
            h = 185
            c = ORANGE
        else:
            h = 120
            c = PURPLE
        s.rect(x, base - h, 10, h, fill=c, r=2)
        x += 14
        k += 1
    s.add(f'<text x="34" y="{(base + top) / 2}" font-family="{FONT}" font-size="13" fill="{MUTED}" text-anchor="middle" transform="rotate(-90 34 {(base + top) / 2})">all-reduce size (log)</text>')
    s.text((x0 + x1) / 2, base + 26, "serving steps over time →", size=13, fill=MUTED, anchor="middle")
    lx = 90
    for lab, c in (("decode: running requests × hidden × 2 B", BLUE), ("prefill: chunk budget × hidden × 2 B", ORANGE), ("mixed: chunk + running decode tokens", PURPLE)):
        s.rect(lx, 270, 14, 14, fill=c, r=2)
        s.text(lx + 20, 282, lab, size=12)
        lx += 300
    s.text(x1, 28, "illustrative", size=12, fill=FAINT, anchor="end", italic=True)
    s.save("p4-step-timeline")


def kv_cap():
    """Running requests plateau at the KV cap; beyond it you measure the queue."""
    s = Svg(980, 320)
    for p in range(2):
        ox = 60 + p * 480
        x0, x1, base, top = ox, ox + 400, 250, 50
        s.line(x0, base, x1, base, stroke=INK, sw=1.5)
        s.line(x0, base, x0, top, stroke=INK, sw=1.5)
        cap_x = x0 + 160
        s.line(cap_x, top, cap_x, base, stroke=FAINT, sw=1.5, dash="5 5")
        s.text(cap_x, top - 10, "KV-cache cap", size=12, fill=MUTED, anchor="middle", weight=600)
        s.text((x0 + x1) / 2, base + 28, "concurrency you send →", size=13, fill=MUTED, anchor="middle")
        if p == 0:
            py = base - 100
            sx = x0 + (base - top - 5) / 0.625
            s.path(f"M {x0} {base} L {cap_x} {py} L {x1} {py}", stroke=BLUE, sw=3)
            s.path(f"M {cap_x} {py} L {sx} {top + 5}", stroke=ORANGE, sw=3, dash="7 5")
            s.text(x1 - 4, py + 24, "running", size=13, fill=BLUE, anchor="end", weight=700)
            s.text(sx - 30, top + 12, "sent", size=13, fill=ORANGE, anchor="end", weight=700)
            s.text(cap_x + 150, py - 22, "gap = queue", size=12, fill=ORANGE, anchor="middle", weight=600)
        else:
            s.path(f"M {x0} {base} Q {cap_x - 40} {top + 50} {cap_x} {top + 45} L {x1} {top + 40}", stroke=GREEN, sw=3)
            s.path(f"M {x0} {base - 20} L {cap_x} {base - 35} Q {cap_x + 100} {base - 60} {x1} {top + 5}", stroke=ORANGE, sw=3)
            s.text(cap_x + 16, top + 28, "throughput: flat", size=13, fill=GREEN, weight=700)
            s.text(cap_x + 40, base - 8, "latency: climbs", size=13, fill=ORANGE, weight=700)
    s.text(60, 300, "max running ≈ KV pool tokens ÷ (input + output tokens per request)", size=14, mono=True)
    s.text(940, 300, "illustrative", size=12, fill=FAINT, anchor="end", italic=True)
    s.save("p4-kv-cap")


def eager_vs_graph():
    """Eager mode counts launch gaps as communication."""
    s = Svg(980, 300)
    for r, t in enumerate(("eager mode", "CUDA graph")):
        y = 60 + r * 110
        s.text(30, y + 24, t, size=15, weight=700)
        x = 160
        for k in range(3):
            if r == 0:
                x += 18  # launch gap before the next kernel
            s.rect(x, y, 90, 36, fill=BLUE, r=4)
            s.text(x + 45, y + 23, "compute", size=12, fill="#fff", anchor="middle")
            x += 94
            if r == 0:
                s.rect(x, y, 44, 36, fill=ORANGE_L, stroke=ORANGE, sw=1, r=4)
                s.text(x + 22, y + 23, "spin", size=11, fill=ORANGE, anchor="middle", weight=600)
                x += 46
            s.rect(x, y, 80, 36, fill=GREEN, r=4)
            s.text(x + 40, y + 23, "all-reduce", size=11, fill="#fff", anchor="middle", weight=600)
            x += 84
        if r == 0:
            s.text(160, y + 62, "launch gaps let ranks drift apart; the early ones spin inside the all-reduce, and the profiler bills it as communication", size=12, fill=ORANGE)
        else:
            s.text(160, y + 62, "replayed back to back: what remains is the collective itself", size=12, fill=GREEN)
    s.rect(30, 268, 14, 14, fill=ORANGE_L, r=2)
    s.text(50, 280, "time a profiler bills to communication that is really launch overhead", size=12, fill=MUTED)
    s.save("p4-eager-vs-graph")


if __name__ == "__main__":
    for fn in (
        rig, tp_layer, ring_allreduce, alpha_beta, message_sizes, decomposition, eth_crossing, two_nics, scaling_math,
        protocols, protocol_tradeoff, ring_vs_tree, nccl_decision, size_rule, tuner_wiring,
        two_fabrics, layouts, mla_kv, decision_tree,
        step_timeline, kv_cap, eager_vs_graph,
    ):
        fn()
