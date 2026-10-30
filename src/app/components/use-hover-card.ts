import { useEffect, useRef, type FocusEvent, type PointerEvent, type RefObject } from "react";

const CARD_GAP = 18; // px between the cursor and the preview card's lower edge
const CARD_FOLLOW = 0.25; // share of the remaining distance the card covers each frame as it trails the cursor

/**
 * Floats a fixed card above the cursor while a link is hovered, trailing it a little as it moves. The card is the
 * element `cardRef` is put on; the link gets the handlers. Shared by the pagers under the write-ups.
 */
export function useHoverCard(): {
    cardRef: RefObject<HTMLSpanElement | null>;
    onPointerEnter: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onFocus: (e: FocusEvent<HTMLElement>) => void;
} {
    const cardRef = useRef<HTMLSpanElement>(null);
    const follow = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

    useEffect(() => () => cancelAnimationFrame(follow.current.raf), []);

    // Above the point and centred on it, kept on screen; flips below when there's no room above.
    const aim = (x: number, y: number) => {
        const card = cardRef.current;
        if (!card) return;
        const f = follow.current;
        f.tx = Math.max(12, Math.min(window.innerWidth - card.offsetWidth - 12, x - card.offsetWidth / 2));
        f.ty = y - card.offsetHeight - CARD_GAP < 12 ? y + CARD_GAP : y - card.offsetHeight - CARD_GAP;
    };
    const place = () => {
        const f = follow.current;
        cardRef.current?.style.setProperty("transform", `translate3d(${f.x}px, ${f.y}px, 0)`);
    };
    const step = () => {
        const f = follow.current;
        f.x += (f.tx - f.x) * CARD_FOLLOW;
        f.y += (f.ty - f.y) * CARD_FOLLOW;
        place();
        f.raf = Math.abs(f.tx - f.x) + Math.abs(f.ty - f.y) > 0.5 ? requestAnimationFrame(step) : 0;
    };
    // Jump straight to the point on arrival so the card doesn't fly in from wherever it last was.
    const settle = (x: number, y: number) => {
        aim(x, y);
        const f = follow.current;
        f.x = f.tx;
        f.y = f.ty;
        place();
    };

    return {
        cardRef,
        onPointerEnter: (e) => settle(e.clientX, e.clientY),
        onPointerMove: (e) => {
            aim(e.clientX, e.clientY);
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                settle(e.clientX, e.clientY);
            } else if (!follow.current.raf) {
                follow.current.raf = requestAnimationFrame(step);
            }
        },
        // From the keyboard there's no cursor, so the card sits over the link itself.
        onFocus: (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            settle(r.left + r.width / 2, r.top);
        },
    };
}

/** The card's own classes: hidden until its link is hovered or focused, then it fades and scales in. */
export const HOVER_CARD =
    "pointer-events-none fixed left-0 top-0 z-50 w-[17rem] rounded-panel border border-hairline bg-background p-2 text-left opacity-0 shadow-[0_12px_32px_rgb(0_0_0/0.25)] transition-[opacity,scale] duration-200 ease-out [scale:0.96] will-change-transform group-hover:opacity-100 group-hover:[scale:1] group-focus-visible:opacity-100 group-focus-visible:[scale:1]";
