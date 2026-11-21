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
 * A photo painted onto the page in watercolour, then left under a thin film of water.
 *
 * When it scrolls into view, a pale wash blooms outward from a few points, the way pigment spreads across wet paper,
 * with the darker line that collects at a bloom's edge; the photo's detail settles in a beat behind the wash. The
 * frame keeps a deckled paper edge with a faint rim of pooled pigment. Afterwards, moving the cursor across it sends
 * small ripples through the photo, bending it like the surface of the koi pond, and a click drops a larger one.
 *
 * Everything happens in one fragment shader. Without WebGL, or with reduced motion, it is the plain photo.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const MAX_RIPPLES = 8;
const BLOOM_SECONDS = 2.6;
const RIPPLE_SECONDS = 2.4;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;      // canvas size in CSS px
uniform vec2 uImg;      // photo size in px
uniform float uScale;   // device pixels per CSS px
uniform float uT;       // seconds since the bloom began
uniform float uNow;     // seconds, for ripples
uniform vec3 uPaper;
uniform float uSeed;
uniform vec4 uRipples[${MAX_RIPPLES}]; // x, y (px), start time, strength

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), u.x), u.y);
}
float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
}

// Canvas px to photo uv, cropped the way object-fit: cover crops.
vec2 coverUv(vec2 p) {
    float s = max(uRes.x / uImg.x, uRes.y / uImg.y);
    vec2 size = uImg * s;
    return (p + (size - uRes) * 0.5) / size;
}

vec3 photo(vec2 p) { return texture2D(uTex, coverUv(clamp(p, vec2(0.5), uRes - 0.5))).rgb; }

void main() {
    vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uRes;

    // Ripples: rings that travel outward and fade, bending where the photo is sampled.
    vec2 bend = vec2(0.0);
    float sheen = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
        vec4 r = uRipples[i];
        float age = uNow - r.z;
        if (r.w <= 0.0 || age < 0.0 || age > ${RIPPLE_SECONDS.toFixed(1)}) continue;
        vec2 d = p - r.xy;
        float dist = length(d) + 0.0001;
        float front = age * 210.0;
        float band = (dist - front) / 22.0;
        float wave = sin((dist - front) * 0.16) * exp(-band * band) * exp(-age * 1.7) * r.w;
        bend += (d / dist) * wave * 6.0;
        sheen += wave;
    }
    vec2 q = p + bend;

    // The deckled edge: a frame worn ragged by noise, a pixel of feather, and a rim of pooled pigment.
    float edgeDist = min(min(p.x, uRes.x - p.x), min(p.y, uRes.y - p.y));
    float ragged = (fbm(p / 70.0) - 0.5) * 16.0 + (noise(p / 6.0) - 0.5) * 3.0;
    float e = edgeDist + ragged;
    float frame = smoothstep(5.0, 5.6 + 1.2 / uScale, e);
    float rim = smoothstep(16.0, 6.0, e) * frame;

    // The bloom: distance from three wet points, warped so it spreads like pigment, not like a circle.
    float diag = length(uRes);
    vec2 s1 = uRes * vec2(0.32 + 0.1 * sin(uSeed), 0.42);
    vec2 s2 = uRes * vec2(0.7, 0.36 + 0.1 * cos(uSeed));
    vec2 s3 = uRes * vec2(0.52, 0.74);
    float f = min(min(length(p - s1), length(p - s2) * 1.1), length(p - s3) * 1.2) / diag;
    f += (fbm(p / 110.0 + uT * 0.04) - 0.5) * 0.32 + (noise(p / 14.0) - 0.5) * 0.03;

    float ease = 1.0 - pow(1.0 - clamp(uT / 2.1, 0.0, 1.0), 3.0);
    float front = ease * 1.05 - 0.05;
    float wash = smoothstep(front + 0.015, front - 0.05, f);
    float lag = clamp((uT - 0.35) / 2.0, 0.0, 1.0);
    float detailFront = (1.0 - pow(1.0 - lag, 2.4)) * 1.15 - 0.1;
    float detail = smoothstep(detailFront + 0.02, detailFront - 0.16, f);

    // The wash: a soft, pale, slightly desaturated photo, as the first thin layer of paint.
    vec3 soft = (photo(q) * 2.0 + photo(q + vec2(5.0, 2.0)) + photo(q - vec2(4.0, 3.0)) + photo(q + vec2(-2.0, 5.0)) + photo(q + vec2(3.0, -5.0))) / 6.0;
    float lum = dot(soft, vec3(0.299, 0.587, 0.114));
    vec3 washCol = mix(uPaper, mix(vec3(lum), soft, 0.7), 0.72);
    washCol *= 0.94 + 0.06 * noise(p / 2.2); // paper grain

    vec3 col = mix(washCol, photo(q), detail);
    // Pigment gathers along the moving edge of a bloom, and at the frame's edge.
    float bloomLine = wash * (1.0 - wash) * 4.0 * (1.0 - detail);
    col *= 1.0 - 0.16 * bloomLine;
    col *= 1.0 - 0.12 * rim;
    col += sheen * 0.05;

    float a = wash * frame;
    gl_FragColor = vec4(col * a, a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
    }
    return s;
}

type Ripple = { x: number; y: number; t: number; s: number };

const PAPER = { light: [0.965, 0.953, 0.925], dark: [0.09, 0.086, 0.078] } as const;

export default function PondImage({ src, alt, ratio, sizes, priority, className, blurDataURL }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const redrawRef = useRef<() => void>(() => {});
    const [loaded, setLoaded] = useState(false);
    const isDark = useTheme().resolvedTheme === "dark";
    const paperRef = useRef<readonly number[]>(PAPER.light);

    useEffect(() => {
        paperRef.current = isDark ? PAPER.dark : PAPER.light;
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
        const vs = compile(gl, gl.VERTEX_SHADER, VERT);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        const prog = gl.createProgram();
        if (!vs || !fs || !prog) return;
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(prog, "aPos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

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

        const u = (name: string) => gl.getUniformLocation(prog, name);
        const uRes = u("uRes");
        const uScale = u("uScale");
        const uT = u("uT");
        const uNow = u("uNow");
        const uPaper = u("uPaper");
        const uRipples = u("uRipples");
        gl.uniform2f(u("uImg"), img.naturalWidth, img.naturalHeight);
        gl.uniform1f(u("uSeed"), (img.naturalWidth * 7 + img.naturalHeight * 13) % 97);

        let bloomAt = -1;
        let raf = 0;
        const ripples: Ripple[] = [];
        const rippleData = new Float32Array(MAX_RIPPLES * 4);
        const clock = () => performance.now() / 1000;

        const size = () => {
            const rect = wrap.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(1, Math.round(rect.width * dpr));
            canvas.height = Math.max(1, Math.round(rect.height * dpr));
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, rect.width, rect.height);
            gl.uniform1f(uScale, dpr);
        };

        const draw = () => {
            const now = clock();
            const t = bloomAt < 0 ? 0 : Math.max(0, now - bloomAt);
            while (ripples.length && now - ripples[0].t > RIPPLE_SECONDS) ripples.shift();
            gl.uniform1f(uT, t);
            gl.uniform1f(uNow, now);
            gl.uniform3f(uPaper, paperRef.current[0], paperRef.current[1], paperRef.current[2]);
            rippleData.fill(0);
            ripples.forEach((r, i) => rippleData.set([r.x, r.y, r.t, r.s], i * 4));
            gl.uniform4fv(uRipples, rippleData);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            // Keep going while the bloom is still spreading or a ripple is still moving.
            return (bloomAt >= 0 && now - bloomAt < BLOOM_SECONDS) || ripples.length > 0;
        };

        const frame = () => {
            raf = draw() ? requestAnimationFrame(frame) : 0;
        };
        const wake = () => {
            if (!raf) raf = requestAnimationFrame(frame);
        };
        redrawRef.current = () => draw();

        size();
        draw();
        // The shader is drawing now; the <img> underneath steps back (it stays for alt text and as the fallback).
        img.style.opacity = "0";

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || bloomAt >= 0) return;
                bloomAt = clock() + 0.1;
                wake();
            },
            { threshold: 0.3 }
        );
        io.observe(wrap);

        let lastDrop = { x: -1e4, y: -1e4, t: 0 };
        const drop = (x: number, y: number, s: number) => {
            ripples.push({ x, y, t: clock(), s });
            if (ripples.length > MAX_RIPPLES) ripples.shift();
            wake();
        };
        const local = (e: PointerEvent) => {
            const rect = wrap.getBoundingClientRect();
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        // A ripple trails the cursor every so often, spaced out so the surface stays calm enough to see.
        const onMove = (e: PointerEvent) => {
            if (bloomAt < 0 || e.pointerType === "touch") return;
            const { x, y } = local(e);
            const now = clock();
            if (Math.hypot(x - lastDrop.x, y - lastDrop.y) < 46 || now - lastDrop.t < 0.14) return;
            lastDrop = { x, y, t: now };
            drop(x, y, 0.45);
        };
        const onDown = (e: PointerEvent) => {
            if (bloomAt < 0) return;
            const { x, y } = local(e);
            drop(x, y, 1);
        };
        const ro = new ResizeObserver(() => {
            size();
            draw();
        });
        ro.observe(wrap);
        wrap.addEventListener("pointermove", onMove, { passive: true });
        wrap.addEventListener("pointerdown", onDown, { passive: true });

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            wrap.removeEventListener("pointermove", onMove);
            wrap.removeEventListener("pointerdown", onDown);
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
            <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
    );
}
