import type { ComponentType } from "react";
import { MUTED } from "../styles";
import { BreakdownChart, ForcedChart, LatencyChart, LayoutMap, ScaleUpTrends, ShareChart } from "./charts";
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
    "scale-up-trends": ScaleUpTrends,
    "layout-map": LayoutMap,
};

/**
 * A drawing rendered into the page as SVG: no background, ink in the theme's colours, numbered with the figures.
 */
export function Diagram({ name, caption, number }: { name: string; caption?: string; number?: string }) {
    const Drawing = DIAGRAMS[name];
    if (!Drawing) throw new Error(`<Diagram name="${name}"> is not a known diagram`);
    return (
        <figure data-wide className="my-6 flex flex-col gap-3">
            {/* On phones a diagram keeps a readable width and scrolls sideways, edge to edge, instead of shrinking. */}
            <div className="-mx-6 overflow-x-auto px-6 text-foreground sm:mx-0 sm:overflow-visible sm:px-0">
                <div className="min-w-[580px] sm:min-w-0">
                    <Drawing />
                </div>
            </div>
            {(number || caption) && (
                <figcaption className={`text-small ${MUTED}`}>
                    {number && (
                        <span className="font-medium text-foreground">
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
