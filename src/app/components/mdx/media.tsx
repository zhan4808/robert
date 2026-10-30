import { MUTED } from "./styles";

/** A video with the browser's controls, and an optional caption. */
export function Video({ src, caption }: { src: string; caption?: string }) {
    return (
        <figure className="flex flex-col gap-2">
            <video src={src} controls playsInline className="w-full rounded-card bg-black" />
            {caption && <figcaption className={`font-geistMono text-caption ${MUTED}`}>{caption}</figcaption>}
        </figure>
    );
}

/** A band of colour, from Tailwind gradient stops: "from-orange-300 via-pink-300 to-blue-300". */
export function Gradient({ className }: { className: string }) {
    return <div className={`h-32 w-full rounded-card bg-gradient-to-br ${className}`} />;
}
