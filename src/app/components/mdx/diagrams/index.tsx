import type { ComponentType } from "react";
import { MUTED } from "../styles";
import { BreakdownChart, ForcedChart, LatencyChart, ShareChart } from "./charts";
import * as sketches from "./sketches";

/** Every drawing a write-up can name, by the id it is written with: `<Diagram name="ring-allreduce" />`. */
const DIAGRAMS: Record<string, ComponentType> = {
    rig: sketches.Rig,
    "tp-block": sketches.TpBlock,
    "ring-allreduce": sketches.RingAllReduce,
    "alpha-beta": sketches.AlphaBeta,
    "message-sizes": sketches.MessageSizes,
    "eth-crossing": sketches.EthCrossing,
    "two-nics": sketches.TwoNics,
    protocols: sketches.Protocols,
    "ring-vs-tree": sketches.RingVsTree,
    "size-rule": sketches.SizeRule,
    "two-fabrics": sketches.TwoFabrics,
    layouts: sketches.Layouts,
    "mla-kv": sketches.MlaKv,
    "kv-cap": sketches.KvCap,
    "eager-vs-graph": sketches.EagerVsGraph,
    "chart-breakdown": BreakdownChart,
    "chart-latency": LatencyChart,
    "chart-share": ShareChart,
    "chart-forced": ForcedChart,
};

/**
 * A drawing rendered into the page as SVG: no background, ink in the theme's colours, numbered with the figures.
 */
export function Diagram({ name, caption, number }: { name: string; caption?: string; number?: string }) {
    const Drawing = DIAGRAMS[name];
    if (!Drawing) throw new Error(`<Diagram name="${name}"> is not a known diagram`);
    return (
        <figure className="my-4 flex flex-col gap-3">
            <div className="text-foreground">
                <Drawing />
            </div>
            {(number || caption) && (
                <figcaption className={`font-geistMono text-caption ${MUTED}`}>
                    {number && (
                        <span className="text-foreground">
                            Figure {number}
                            {caption ? "." : ""}
                        </span>
                    )}
                    {caption && <> {caption}</>}
                </figcaption>
            )}
        </figure>
    );
}
