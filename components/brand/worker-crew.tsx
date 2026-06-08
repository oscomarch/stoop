"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion } from "motion/react";

import { Walker, type NeighborLook, type ToolKind } from "./people";
import { cn } from "@/lib/utils";

type Member = {
  trade: string;
  look: NeighborLook;
  pants: string;
  vest: string;
  helmet: string;
  tool: ToolKind;
};

// A mixed crew of trades, so the line reads as the whole block of pros, not
// one person. Varied skin, vests, helmets and tools keep them distinct.
const CREW: Member[] = [
  {
    trade: "Electrician",
    look: { skin: "#8d5524", hair: "#2a2a27", hairStyle: "short", shirt: "#5f6f8a" },
    pants: "#2f3a44",
    vest: "#d6e34a",
    helmet: "#f2b705",
    tool: "bulb",
  },
  {
    trade: "Plumber",
    look: { skin: "#e0a87e", hair: "#4a3a2c", hairStyle: "short", shirt: "#9c5f47" },
    pants: "#37322e",
    vest: "#ff8a1e",
    helmet: "#eef1ee",
    tool: "wrench",
  },
  {
    trade: "Painter",
    look: { skin: "#c68642", hair: "#1f1f1d", hairStyle: "short", shirt: "#d8cdbb" },
    pants: "#555049",
    vest: "#d6e34a",
    helmet: "#d76a45",
    tool: "roller",
  },
  {
    trade: "Landscaper",
    look: { skin: "#a8703c", hair: "#2a2a27", hairStyle: "short", shirt: "#5f7f55" },
    pants: "#46403a",
    vest: "#ff8a1e",
    helmet: "#6f9a5e",
    tool: "plant",
  },
];

export function WorkerCrew({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const show = reduce || inView;

  return (
    <div
      ref={ref}
      className={cn("relative mx-auto flex max-w-3xl flex-col items-center", className)}
    >
      <m.div
        className="w-max max-w-[19rem]"
        initial={{ opacity: 0, y: 10, scale: 0.94 }}
        animate={
          show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.94 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 360, damping: 26, delay: 0.15 }
        }
      >
        <div className="relative rounded-2xl border border-cream-200 bg-cream-50 px-5 py-3 text-center font-ui text-base font-semibold leading-snug text-ink-800 shadow-stoop">
          We only pay when we actually win the work.
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-cream-200 bg-cream-50"
          />
        </div>
      </m.div>

      <div className="mt-5 flex items-end justify-center gap-1 sm:gap-4">
        {CREW.map((m) => (
          <Walker
            key={m.trade}
            worker
            walking={false}
            look={m.look}
            pants={m.pants}
            vest={m.vest}
            helmet={m.helmet}
            tool={m.tool}
            className="h-[124px] w-auto sm:h-[156px]"
          />
        ))}
      </div>
    </div>
  );
}
