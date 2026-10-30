import { useSyncExternalStore } from "react";

/**
 * Which audio player is playing, site-wide. A player claims the slot when it starts; every other player watches the
 * slot and pauses itself when it is taken, so only one track plays at a time.
 */

let current: string | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const read = () => current;
const readOnServer = () => null;

/** Marks `id` as the player that is playing. */
export function claimPlayback(id: string) {
    if (current === id) return;
    current = id;
    emit();
}

/** Clears the slot if `id` still holds it; a player that paused or ended on its own calls this. */
export function releasePlayback(id: string) {
    if (current !== id) return;
    current = null;
    emit();
}

/** The id of the player that is playing, or null. */
export function useNowPlaying(): string | null {
    return useSyncExternalStore(subscribe, read, readOnServer);
}
