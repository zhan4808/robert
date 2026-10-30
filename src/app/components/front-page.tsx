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
];

const UNDERLINE =
    "underline decoration-faint decoration-1 underline-offset-[5px] outline-none transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

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
                    target="_blank"
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
                    className="absolute right-6 top-8 font-geistMono text-label leading-relaxed tabular-nums lg:right-gutter"
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
                className="font-geistMono text-small lowercase leading-relaxed tracking-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-koi-avoid
                className="cited-prose max-w-[54rem] font-geistMono text-ui leading-[max(22px,3vh)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h1>Hi, I&apos;m Robert.</h1>
                <p>
                    Applied AI @ <Cited source="astera">Astera Labs</Cited>, passionate about making models run fast.
                </p>
                <p>
                    Before that, <Cited source="sandisk">SanDisk</Cited>, <Cited source="endian">Endian</Cited>, and a
                    couple of <Cited source="labs">research labs</Cited>.
                </p>
                <p>
                    Currently, researching @ <Cited source="socet">Purdue SoCET</Cited>, fellow @{" "}
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
                className="text-meta lowercase leading-relaxed tracking-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-koi-avoid
                className="flex flex-col gap-3 text-small leading-compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h1>Hi, I&apos;m Robert.</h1>
                <p>
                    Applied AI @ <MobileLink source="astera">Astera Labs</MobileLink>, passionate about making models
                    run fast.
                </p>
                <p>
                    Before that, <MobileLink source="sandisk">SanDisk</MobileLink>,{" "}
                    <MobileLink source="endian">Endian</MobileLink>, and a couple of research labs.
                </p>
                <p>
                    Currently, researching @ <MobileLink source="socet">Purdue SoCET</MobileLink>, fellow @{" "}
                    <MobileLink source="comma">Comma Capital</MobileLink>.
                </p>
                <Socials className="mt-2" />
            </motion.div>
        </Container>
    );
};

export default FrontPage;
