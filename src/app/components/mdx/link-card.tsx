import { MUTED } from "./styles";

/** A link on its own line, opening in a new tab, with a line under it saying what it is. */
export function LinkCard({ href, label, description }: { href: string; label: string; description?: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <a href={href} target="_blank" rel="noopener noreferrer" className="ink-link w-fit text-ui">
                {label}
            </a>
            {description && <p className={`text-small ${MUTED}`}>{description}</p>}
        </div>
    );
}
