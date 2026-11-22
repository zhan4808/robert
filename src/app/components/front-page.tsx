"use client";

import Link from "next/link";
import Cited from "./citation";

/**
 * The introduction under the banner. Each @-mention opens a small card about the place on hover (and links straight
 * to it on touch, where there is no hover).
 */
export default function FrontPage() {
    return (
        <section className="flex flex-col gap-4">
            <h1 className="font-serif text-display font-normal">Robert Zhang</h1>
            <div className="cited-prose flex flex-col gap-4 text-body leading-body text-prose [text-wrap:pretty]">
                <p>
                    I work in the CTO office at <Cited source="astera">Astera Labs</Cited>, where most of my time goes
                    into making large models run fast on hardware that wasn&apos;t built around them.
                </p>
                <p>
                    Before that I was at <Cited source="sandisk">SanDisk</Cited> and{" "}
                    <Cited source="endian">Endian</Cited>, and in <Cited source="labs">a couple of research labs</Cited>
                    . I&apos;m currently researching at <Cited source="socet">Purdue SoCET</Cited> and a fellow at{" "}
                    <Cited source="comma">Comma Capital</Cited>.
                </p>
                <p>
                    Lately I&apos;ve been writing a four-part series on{" "}
                    <Link href="/blog/tp-without-nvlink" className="ink-link">
                        LLM inference without NVLink
                    </Link>
                    ; before that I{" "}
                    <Link href="/projects/mla-profiling" className="ink-link">
                        profiled MLA kernels on H100
                    </Link>
                    .
                </p>
            </div>
        </section>
    );
}
