/** The blinking block cursor that ends the one-line taglines; still under reduced motion. */
export default function Cursor() {
    return (
        <span
            aria-hidden="true"
            className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
        />
    );
}
