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
            {/*
             * Every drawing is a 720-unit canvas whose smallest labels are 11.4 units, so it scales with the column only
             * from lg up, where it has its full width. Below that, shrunk to fit, those labels would fall under 11px; it
             * keeps a readable width instead and scrolls sideways, edge to edge, with the right edge fading out to show
             * there is more. It can take focus so the keyboard can scroll it too.
             */}
            <div
                tabIndex={0}
                role="region"
                aria-label={number ? `Figure ${number}` : "Diagram"}
                className="-mx-6 overflow-x-auto px-6 text-foreground focus-ring [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] lg:mx-0 lg:overflow-visible lg:px-0 lg:[mask-image:none]"
            >
                <div className="min-w-[696px] lg:min-w-0">
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
