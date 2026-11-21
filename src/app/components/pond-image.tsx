"use client";

import Image, { type StaticImageData } from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type Props = {
    src: string | StaticImageData;
    alt: string;
    /** Width over height of the frame; the photo is cropped to fill it. */
    ratio: number;
    sizes?: string;
    priority?: boolean;
    className?: string;
    blurDataURL?: string;
};

/*
 * A photo drawn in dots before it is drawn in colour.
 *
 * When it scrolls into view, a loose cloud of ink dots drifts in from around the frame and settles onto a grid,
 * where together they form an ordered-dither halftone of the photo; a few strays keep drifting at the edges. Once
 * the halftone has formed it dissolves into the photo itself. Afterwards the cursor is a dot-matrix lens: under it
 * the photo goes back to dots, with a scatter of loose ones around the rim.
 *
 * Two WebGL programs: points for the dots in flight, and a quad for the settled photo and the lens. Without WebGL,
 * or with reduced motion, it's the plain photo.
 */

const CELL = 3; // CSS px between dot centres
const MARGIN = 28; // the canvas reaches this far past the frame, so dots can arrive from outside it
const SETTLE_START = 1.25; // s: the halftone starts handing over to the photo
const SETTLE_END = 1.9;
const LENS = 74; // px radius of the cursor's lens

const DITHER = `
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`;

const POINT_VERT = `
attribute vec4 aDot; // cell x, cell y, seed 0..1, 1 if the dot belongs to the halftone
uniform vec2 uRes;
uniform float uCell;
uniform float uMargin;
uniform float uT;
uniform float uScale;
uniform vec2 uCenter;
varying float vAlpha;
void main() {
    vec2 target = vec2(uMargin) + (aDot.xy + 0.5) * uCell;
    float seed = aDot.z;
    // Each dot starts somewhere out in a ring around its target and spirals in, later the further out it began.
    float ang = seed * 43.0 + aDot.x * 0.13 - aDot.y * 0.07;
    vec2 away = normalize(target - uCenter + vec2(0.001));
    vec2 dir = normalize(away + vec2(cos(ang), sin(ang)) * 0.9);
    float reach = 40.0 + fract(seed * 7.31) * 150.0;
    vec2 start = target + dir * reach;
    float delay = fract(seed * 3.17) * 0.45 + length(target - uCenter) / length(uRes) * 0.35;
    float p = clamp((uT - delay) / 0.75, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - p, 3.0);
    vec2 pos = mix(start, target, e);
    // A sideways drift that dies out as the dot lands.
    pos += vec2(sin(uT * 2.0 + seed * 20.0), cos(uT * 1.7 + seed * 13.0)) * 6.0 * (1.0 - e);

    float settle = smoothstep(${SETTLE_START.toFixed(2)}, ${SETTLE_END.toFixed(2)}, uT);
    if (aDot.w > 0.5) {
        vAlpha = smoothstep(0.0, 0.25, p) * (1.0 - settle);
    } else {
        // A few strays never land: they drift through and fade before the photo arrives.
        vAlpha = seed < 0.035 ? sin(clamp(uT / 1.4, 0.0, 1.0) * 3.14159) * 0.75 : 0.0;
        pos = start + dir * uT * 18.0;
    }
    gl_Position = vec4((pos / uRes) * 2.0 - 1.0, 0.0, 1.0) * vec4(1.0, -1.0, 1.0, 1.0);
    gl_PointSize = uCell * 0.62 * uScale;
}`;

const POINT_FRAG = `
precision mediump float;
uniform vec3 uInk;
varying float vAlpha;
void main() {
    if (vAlpha <= 0.002) discard;
    gl_FragColor = vec4(uInk * vAlpha, vAlpha);
}`;

const QUAD_VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const QUAD_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec4 uFrame;   // x, y, w, h of the photo inside the canvas, CSS px
uniform vec2 uImg;
uniform float uCell;
uniform float uSettle; // 0 before the photo arrives, 1 once it has
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec2 uMouse;
uniform float uLens;   // lens radius in px, eased in and out
uniform float uNow;
uniform float uDark;   // 1 on the dark page: dots mark the light parts instead of the dark ones
${DITHER}
vec2 coverUv(vec2 q) {
    float s = max(uFrame.z / uImg.x, uFrame.w / uImg.y);
    vec2 size = uImg * s;
    return (q + (size - uFrame.zw) * 0.5) / size;
}
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
void main() {
    vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uRes;
    vec2 q = p - uFrame.xy;
    bool inside = q.x >= 0.0 && q.y >= 0.0 && q.x < uFrame.z && q.y < uFrame.w;

    // The lens: inside it, the photo is shown as the halftone again; around its rim, loose dots come and go.
    float d = length(p - uMouse);
    vec2 cell = floor(q / uCell);
    vec2 local = fract(q / uCell);
    float rim = uLens * (1.0 + 0.25 * (hash(cell + floor(uNow * 6.0)) - 0.5));
    float lens = uLens > 0.5 ? 1.0 - smoothstep(rim * 0.82, rim, d) : 0.0;
    float stray = 0.0;
    if (uLens > 0.5 && d > rim && d < uLens * 1.45) {
        stray = step(0.965, hash(cell * 1.7 + floor(uNow * 8.0))) * (1.0 - (d - rim) / (uLens * 0.45));
    }

    vec4 col = vec4(0.0);
    if (inside) {
        vec3 photo = texture2D(uTex, coverUv(q)).rgb;
        col = vec4(photo, 1.0) * uSettle;
        if (lens > 0.0) {
            vec3 c = texture2D(uTex, coverUv((cell + 0.5) * uCell)).rgb;
            float on = uDark > 0.5 ? step(bayer8(cell), lum(c)) : step(lum(c), bayer8(cell));
            float dotMask = step(abs(local.x - 0.5), 0.31) * step(abs(local.y - 0.5), 0.31);
            vec3 tone = mix(uPaper, uInk, on * dotMask);
            col = mix(col, vec4(tone, 1.0) * uSettle, lens);
        }
    }
    if (stray > 0.0) {
        float dotMask = step(abs(local.x - 0.5), 0.31) * step(abs(local.y - 0.5), 0.31);
        col = mix(col, vec4(uInk, 1.0), stray * dotMask * uSettle);
    }
    gl_FragColor = col;
}`;

function program(gl: WebGLRenderingContext, vert: string, frag: string) {
    const make = (type: number, src: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = make(gl.VERTEX_SHADER, vert);
    const fs = make(gl.FRAGMENT_SHADER, frag);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

// 4x4 Bayer thresholds, matching the shader's bayer8 closely enough that the dots land where the lens draws them.
function bayer8(x: number, y: number) {
    const b2 = (a: number, b: number) => {
        a = Math.floor(a);
        b = Math.floor(b);
        const v = a * 0.5 + b * b * 0.75;
        return v - Math.floor(v);
    };
    const b4 = (a: number, b: number) => b2(a * 0.5, b * 0.5) * 0.25 + b2(a, b);
    return b4(x * 0.5, y * 0.5) * 0.25 + b2(x, y);
}

const COLORS = {
    light: { ink: [0.145, 0.133, 0.114], paper: [0.965, 0.953, 0.925] },
    dark: { ink: [0.953, 0.933, 0.902], paper: [0.09, 0.086, 0.078] },
} as const;

export default function PondImage({ src, alt, ratio, sizes, priority, className, blurDataURL }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const redrawRef = useRef<() => void>(() => {});
    const [loaded, setLoaded] = useState(false);
    const isDark = useTheme().resolvedTheme === "dark";
    const colorsRef = useRef<(typeof COLORS)[keyof typeof COLORS]>(COLORS.light);

    useEffect(() => {
        colorsRef.current = isDark ? COLORS.dark : COLORS.light;
        redrawRef.current();
    }, [isDark]);

    // A cached photo can finish loading before hydration attaches onLoad.
    useEffect(() => {
        const img = imgRef.current;
        if (img?.complete && img.naturalWidth > 0) setLoaded(true);
    }, []);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!wrap || !canvas || !img || !loaded) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
        if (!gl) return;
        const dots = program(gl, POINT_VERT, POINT_FRAG);
        const quad = program(gl, QUAD_VERT, QUAD_FRAG);
        if (!dots || !quad) return;

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        try {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        } catch {
            return;
        }

        const quadBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const dotBuf = gl.createBuffer();
        let dotCount = 0;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        let W = 0;
        let H = 0;
        let dpr = 1;
        let shownAt = -1;
        let raf = 0;
        const mouse = { x: -1e4, y: -1e4, over: false, lens: 0 };
        const clock = () => performance.now() / 1000;

        // The halftone, worked out once per size: one dot per cell, kept where the photo is darker than the dither.
        const layout = () => {
            const rect = wrap.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round((W + MARGIN * 2) * dpr);
            canvas.height = Math.round((H + MARGIN * 2) * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            const cols = Math.max(1, Math.floor(W / CELL));
            const rows = Math.max(1, Math.floor(H / CELL));
            const off = document.createElement("canvas");
            off.width = cols;
            off.height = rows;
            const o = off.getContext("2d", { willReadFrequently: true });
            if (!o) return;
            const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
            const sw = W / s;
            const sh = H / s;
            o.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
            let px: Uint8ClampedArray;
            try {
                px = o.getImageData(0, 0, cols, rows).data;
            } catch {
                return;
            }
            const dark = colorsRef.current === COLORS.dark;
            const data = new Float32Array(cols * rows * 4);
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    const l = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
                    const seed = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
                    const b = bayer8(c, r);
                    data.set([c, r, seed, (dark ? l > b : l < b) ? 1 : 0], i * 4);
                }
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, dotBuf);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            dotCount = cols * rows;
        };

        const draw = () => {
            const now = clock();
            const t = shownAt < 0 ? 0 : now - shownAt;
            const settle = shownAt < 0 ? 0 : Math.min(1, Math.max(0, (t - SETTLE_START) / (SETTLE_END - SETTLE_START)));
            const eased = settle * settle * (3 - 2 * settle);
            const { ink, paper } = colorsRef.current;
            const cw = W + MARGIN * 2;
            const chh = H + MARGIN * 2;
            mouse.lens += ((mouse.over && settle >= 1 ? LENS : 0) - mouse.lens) * 0.18;

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (eased > 0) {
                gl.useProgram(quad);
                gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
                const a = gl.getAttribLocation(quad, "aPos");
                gl.enableVertexAttribArray(a);
                gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
                const u = (n: string) => gl.getUniformLocation(quad, n);
                gl.uniform2f(u("uRes"), cw, chh);
                gl.uniform4f(u("uFrame"), MARGIN, MARGIN, W, H);
                gl.uniform2f(u("uImg"), img.naturalWidth, img.naturalHeight);
                gl.uniform1f(u("uCell"), CELL);
                gl.uniform1f(u("uSettle"), eased);
                gl.uniform3f(u("uInk"), ink[0], ink[1], ink[2]);
                gl.uniform3f(u("uPaper"), paper[0], paper[1], paper[2]);
                gl.uniform2f(u("uMouse"), mouse.x + MARGIN, mouse.y + MARGIN);
                gl.uniform1f(u("uLens"), mouse.lens);
                gl.uniform1f(u("uNow"), now);
                gl.uniform1f(u("uDark"), colorsRef.current === COLORS.dark ? 1 : 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                gl.disableVertexAttribArray(a);
            }
            if (shownAt >= 0 && settle < 1) {
                gl.useProgram(dots);
                gl.bindBuffer(gl.ARRAY_BUFFER, dotBuf);
                const a = gl.getAttribLocation(dots, "aDot");
                gl.enableVertexAttribArray(a);
                gl.vertexAttribPointer(a, 4, gl.FLOAT, false, 0, 0);
                const u = (n: string) => gl.getUniformLocation(dots, n);
                gl.uniform2f(u("uRes"), cw, chh);
                gl.uniform1f(u("uCell"), CELL);
                gl.uniform1f(u("uMargin"), MARGIN);
                gl.uniform1f(u("uT"), t);
                gl.uniform1f(u("uScale"), dpr);
                gl.uniform2f(u("uCenter"), cw / 2, chh / 2);
                gl.uniform3f(u("uInk"), ink[0], ink[1], ink[2]);
                gl.drawArrays(gl.POINTS, 0, dotCount);
                gl.disableVertexAttribArray(a);
            }
            // Keep animating while the dots are still settling or the lens is open or easing shut.
            return (shownAt >= 0 && settle < 1) || mouse.over || mouse.lens > 0.5;
        };

        const frame = () => {
            raf = draw() ? requestAnimationFrame(frame) : 0;
        };
        const wake = () => {
            if (!raf) raf = requestAnimationFrame(frame);
        };
        redrawRef.current = () => {
            layout();
            draw();
        };

        layout();
        draw();
        img.style.opacity = "0";

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || shownAt >= 0) return;
                shownAt = clock() + 0.05;
                wake();
            },
            { threshold: 0.3 }
        );
        io.observe(wrap);

        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            const rect = wrap.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.over = true;
            wake();
        };
        const onLeave = () => {
            mouse.over = false;
            wake();
        };
        const ro = new ResizeObserver(() => {
            layout();
            draw();
        });
        ro.observe(wrap);
        wrap.addEventListener("pointermove", onMove, { passive: true });
        wrap.addEventListener("pointerleave", onLeave);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            wrap.removeEventListener("pointermove", onMove);
            wrap.removeEventListener("pointerleave", onLeave);
            redrawRef.current = () => {};
            gl.getExtension("WEBGL_lose_context")?.loseContext();
            img.style.opacity = "";
        };
    }, [loaded]);

    return (
        <div ref={wrapRef} className={cn("relative w-full", className)} style={{ aspectRatio: ratio }}>
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                fill
                sizes={sizes ?? "(min-width: 768px) 42rem, 100vw"}
                priority={priority}
                placeholder={blurDataURL || typeof src !== "string" ? "blur" : "empty"}
                blurDataURL={blurDataURL}
                onLoad={() => setLoaded(true)}
                className="object-cover"
            />
            <canvas
                ref={canvasRef}
                aria-hidden
                className="pointer-events-none absolute h-[calc(100%+56px)] w-[calc(100%+56px)]"
                style={{ left: -MARGIN, top: -MARGIN }}
            />
        </div>
    );
}
