"use client";
import { motion } from "motion/react";
import Cited from "./citation";
import Container from "./container";
import type { PondStats } from "./koi-pond/koi-pond";
import { SOURCES } from "../data/sources";

const SOCIALS = [
    { label: "github", href: "https://github.com/zhan4808" },
    { label: "linkedin", href: "https://linkedin.com/in/robert05" },
    { label: "x", href: "https://x.com/robdobflob" },
    { label: "email", href: "mailto:robertzhang930@gmail.com" },
];

const UNDERLINE =
    "underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] outline-none transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

const QuoteLines = () => (
    <>
        let the work
        <br />
        speak for itself
        <span
            aria-hidden="true"
            className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
        />
    </>
);

const Socials = ({ className }: { className?: string }) => (
    <p className={className}>
        {SOCIALS.map(({ label, href }, i) => (
            <span key={label}>
                {i > 0 && <span className="opacity-40"> / </span>}
                <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`${UNDERLINE} opacity-60 hover:opacity-100 focus-visible:opacity-100`}
                >
                    {label}
                </a>
            </span>
        ))}
    </p>
);

const FrontPage = ({ stats }: { stats: PondStats }) => (
    <>
        {mobilePage()}
        {desktopPage({ stats })}
    </>
);

const desktopPage = ({ stats }: { stats: PondStats }) => {
    return (
        <Container
            as="header"
            className="relative flex h-full flex-col justify-end gap-10 max-lg:hidden bg-transparent pb-32 pt-32 text-foreground [@media(max-height:720px)]:gap-6 [@media(max-height:720px)]:pb-12 [@media(max-height:720px)]:pt-20"
        >
            {stats.koi > 0 && (
                <div
                    data-koi-avoid
                    aria-hidden="true"
                    className="absolute right-6 top-8 font-geistMono text-[11px] leading-relaxed tabular-nums lg:right-[20vw]"
                >
                    <div className="opacity-[0.32]">{stats.koi}</div>
                    {/* The pellet count flashes each time it changes, tying a click or a bite to the number. */}
                    <motion.div
                        key={stats.pellets}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0.32 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {stats.pellets}
                    </motion.div>
                </div>
            )}
            <motion.blockquote
                data-koi-avoid
                className="font-geistMono text-[14px] lowercase leading-relaxed tracking-[0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-koi-avoid
                className="cited-prose max-w-[54rem] font-geistMono text-[15px] leading-[max(22px,3vh)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h1>Hi, I&apos;m Robert.</h1>
                <p>
                    Applied AI @ <Cited source="astera">Astera Labs</Cited>, electrical engineering @{" "}
                    <Cited source="purdue">Purdue</Cited>. I work on GPU kernels, ML systems, and the hardware
                    underneath.
                </p>
                <p>
                    Before that, <Cited source="sandisk">SanDisk</Cited>, <Cited source="endian">Endian</Cited>,{" "}
                    <Cited source="stars">STARS</Cited>, and a couple of <Cited source="labs">research labs</Cited>.
                </p>
                <p>
                    Currently, building @ <Cited source="socet">SoCET</Cited>, fellow @{" "}
                    <Cited source="comma">Comma Capital</Cited>.
                </p>
                <Socials className="mt-[1.5vh]" />
            </motion.div>
        </Container>
    );
};

// Hover cards need a pointer, so on touch the mentions link straight to each site.
const MobileLink = ({ source, children }: { source: string; children: React.ReactNode }) => (
    <a href={SOURCES[source].href} target="_blank" rel="noopener noreferrer" className={UNDERLINE}>
        {children}
    </a>
);

const mobilePage = () => {
    return (
        // Top padding clears the floating nav pill.
        <Container
            as="header"
            className="flex h-full flex-col justify-end gap-8 lg:hidden bg-transparent pb-12 pt-28 font-geistMono text-foreground [@media(max-height:640px)]:gap-5 [@media(max-height:640px)]:pb-8"
        >
            <motion.blockquote
                data-koi-avoid
                className="text-[13px] lowercase leading-relaxed tracking-[0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-koi-avoid
                className="flex flex-col gap-3 text-[14px] leading-[1.6]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h1>Hi, I&apos;m Robert.</h1>
                <p>
                    Applied AI @ <MobileLink source="astera">Astera Labs</MobileLink>, electrical engineering @{" "}
                    <MobileLink source="purdue">Purdue</MobileLink>. GPU kernels, ML systems, and the hardware
                    underneath.
                </p>
                <p>
                    Before that, <MobileLink source="sandisk">SanDisk</MobileLink>,{" "}
                    <MobileLink source="endian">Endian</MobileLink>, <MobileLink source="stars">STARS</MobileLink>, and
                    a couple of research labs.
                </p>
                <p>
                    Currently, building @ <MobileLink source="socet">SoCET</MobileLink>, fellow @{" "}
                    <MobileLink source="comma">Comma Capital</MobileLink>.
                </p>
                <Socials className="mt-2" />
            </motion.div>
        </Container>
    );
};

export default FrontPage;
