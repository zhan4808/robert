"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { JournalTrack } from "../../lib/content-schema";
import type { ImageMeta } from "../../lib/images";
import { claimPlayback, releasePlayback, useNowPlaying } from "../../lib/now-playing";

const MUTED = "text-muted";
const SEEK_STEP = 5; // seconds an arrow key moves
const ART = "size-14 shrink-0 rounded-chip";

/** Seconds as "m:ss". */
const clock = (seconds: number) => {
    const whole = Math.floor(seconds);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

/**
 * "loading" until the browser has read the file's length; "idle" when it declined to read ahead (phones), so the
 * length arrives with the first play; "error" when the file can't be fetched or decoded.
 */
type Status = "loading" | "idle" | "ready" | "error";

/**
 * One track of a post's listening list: album art, title and artist, and, when there is an audio file, a play
 * button, a scrubber, and the time. Only one player plays at a time across the site. A track with only a Spotify
 * link shows the link instead of the controls.
 */
export default function AudioPlayer({ track, art }: { track: JournalTrack; art?: ImageMeta }) {
    if (!track.audioSrc) {
        return (
            <li className="flex items-center gap-4">
                <Art track={track} meta={art} />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <Title track={track} />
                    {track.spotifyUrl && (
                        <a
                            href={track.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${track.title} on Spotify`}
                            className={`ink-link shrink-0 font-geistMono text-caption ${MUTED}`}
                        >
                            spotify ↗
                        </a>
                    )}
                </span>
            </li>
        );
    }
    return <Player track={track} art={art} src={track.audioSrc} />;
}

function Player({ track, art, src }: { track: JournalTrack; art?: ImageMeta; src: string }) {
    const id = useId();
    const audioRef = useRef<HTMLAudioElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const handleRef = useRef<HTMLSpanElement>(null);
    const dragging = useRef(false);
    const [status, setStatus] = useState<Status>("loading");
    const [playing, setPlaying] = useState(false);
    // Whole seconds, so the time text re-renders at most once a second; the bar itself is driven by `paint`.
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);
    const nowPlaying = useNowPlaying();

    // The header of a preloaded file can arrive before React hydrates, in which case the loadedmetadata handler
    // below was never attached. Read the element's state once on mount and catch up.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.error) setStatus("error");
        else if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
            setDuration(audio.duration);
            setStatus("ready");
        }
    }, []);

    // Another player started: this one steps aside.
    useEffect(() => {
        const audio = audioRef.current;
        if (nowPlaying !== id && audio && !audio.paused) audio.pause();
    }, [nowPlaying, id]);

    /** Moves the progress and the handle, straight into the DOM; the CSS transition carries them between updates. */
    const paint = (time: number, total: number) => {
        const share = total > 0 ? Math.min(1, Math.max(0, time / total)) : 0;
        fillRef.current?.style.setProperty("transform", `scaleX(${share})`);
        handleRef.current?.style.setProperty("left", `${share * 100}%`);
    };

    const seekTo = (time: number) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const clamped = Math.min(duration, Math.max(0, time));
        audio.currentTime = clamped;
        paint(clamped, duration);
        setElapsed(Math.floor(clamped));
    };

    const seekToPointer = (e: PointerEvent<HTMLDivElement>) => {
        const bar = barRef.current;
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        seekTo(((e.clientX - rect.left) / rect.width) * duration);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const jumps: Record<string, number> = {
            ArrowLeft: audio.currentTime - SEEK_STEP,
            ArrowDown: audio.currentTime - SEEK_STEP,
            ArrowRight: audio.currentTime + SEEK_STEP,
            ArrowUp: audio.currentTime + SEEK_STEP,
            Home: 0,
            End: duration,
        };
        if (!(e.key in jumps)) return;
        e.preventDefault();
        seekTo(jumps[e.key]);
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => setStatus("error"));
        else audio.pause();
    };

    const ready = status === "ready";
    const time =
        status === "error"
            ? "unavailable"
            : status === "loading"
              ? "loading"
              : `${clock(elapsed)} / ${ready ? clock(duration) : "–:––"}`;

    return (
        <li className="flex items-center gap-4" aria-busy={status === "loading"}>
            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                onLoadedMetadata={(e) => {
                    setDuration(e.currentTarget.duration);
                    setStatus("ready");
                }}
                // The browser stopped fetching without reading the header: it isn't going to until play is pressed.
                onSuspend={(e) => {
                    if (e.currentTarget.readyState === 0) setStatus((s) => (s === "loading" ? "idle" : s));
                }}
                onError={() => setStatus("error")}
                onPlay={() => {
                    setPlaying(true);
                    claimPlayback(id);
                }}
                onPause={() => {
                    setPlaying(false);
                    releasePlayback(id);
                }}
                onTimeUpdate={(e) => {
                    if (dragging.current) return;
                    const { currentTime, duration: total } = e.currentTarget;
                    paint(currentTime, total);
                    setElapsed((was) => (Math.floor(currentTime) === was ? was : Math.floor(currentTime)));
                }}
            />
            <Art track={track} meta={art} />
            <button
                type="button"
                onClick={toggle}
                disabled={status === "error"}
                aria-label={`${playing ? "Pause" : "Play"} ${track.title}`}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity duration-150 hover:opacity-80 focus-ring disabled:opacity-30"
            >
                {playing ? <PauseGlyph /> : <PlayGlyph />}
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-4">
                    <Title track={track} />
                    <span className={`shrink-0 font-geistMono text-caption tabular-nums ${MUTED}`}>{time}</span>
                </div>
                {status !== "error" && (
                    <div
                        ref={barRef}
                        role="slider"
                        tabIndex={ready ? 0 : -1}
                        aria-label={`Seek ${track.title}`}
                        aria-valuemin={0}
                        aria-valuemax={Math.round(duration)}
                        aria-valuenow={elapsed}
                        aria-valuetext={`${clock(elapsed)} of ${clock(duration)}`}
                        aria-disabled={!ready}
                        onKeyDown={onKeyDown}
                        onPointerDown={(e) => {
                            if (!ready || e.button !== 0) return;
                            dragging.current = true;
                            e.currentTarget.dataset.dragging = "true";
                            e.currentTarget.setPointerCapture(e.pointerId);
                            seekToPointer(e);
                        }}
                        onPointerMove={(e) => {
                            if (dragging.current) seekToPointer(e);
                        }}
                        onPointerUp={(e) => {
                            dragging.current = false;
                            delete e.currentTarget.dataset.dragging;
                        }}
                        onPointerCancel={(e) => {
                            dragging.current = false;
                            delete e.currentTarget.dataset.dragging;
                        }}
                        className={`group/bar relative flex h-4 items-center rounded-chip focus-ring ${
                            ready ? "cursor-pointer touch-none" : ""
                        }`}
                    >
                        <span className="block h-0.5 w-full overflow-hidden bg-hairline">
                            <span
                                ref={fillRef}
                                className="block h-full w-full origin-left bg-foreground transition-transform duration-300 ease-linear [transform:scaleX(0)] group-data-[dragging=true]/bar:transition-none"
                            />
                        </span>
                        <span
                            ref={handleRef}
                            className="absolute left-0 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground opacity-0 transition-[left,opacity] duration-300 ease-linear group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100 group-data-[dragging=true]/bar:opacity-100 group-data-[dragging=true]/bar:transition-opacity"
                        />
                    </div>
                )}
            </div>
        </li>
    );
}

/** The track's title over its artist, each cut to the line. */
function Title({ track }: { track: JournalTrack }) {
    return (
        <span className="flex min-w-0 flex-col">
            <span className="truncate text-ui">{track.title}</span>
            <span className={`truncate text-small ${MUTED}`}>{track.artist}</span>
        </span>
    );
}

/** Album art at 56px, sized from the manifest and blurred in; a quiet tile when the track has none. */
function Art({ track, meta }: { track: JournalTrack; meta?: ImageMeta }) {
    if (!track.albumArt) return <span className={`${ART} bg-tile`} />;
    return (
        <Image
            src={track.albumArt}
            alt=""
            width={meta?.width ?? 56}
            height={meta?.height ?? 56}
            placeholder={meta ? "blur" : "empty"}
            blurDataURL={meta?.blurDataURL}
            sizes="56px"
            className={`${ART} object-cover`}
        />
    );
}

function PlayGlyph() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="ml-px">
            <path d="M2 1.2v7.6L8.4 5z" fill="currentColor" />
        </svg>
    );
}

function PauseGlyph() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M2 1.5h2.2v7H2zM5.8 1.5H8v7H5.8z" fill="currentColor" />
        </svg>
    );
}
