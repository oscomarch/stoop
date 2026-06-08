"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";

import { Walker, type NeighborLook } from "./people";

type Dir = "left" | "right";

type Stroller = {
  look: NeighborLook;
  pants: string;
  /** Pros get a hi-vis vest + hard hat so they read apart from neighbors. */
  worker?: boolean;
  dir: Dir;
  /** Seconds to cross the block. */
  dur: number;
  /** Seconds before this one starts. */
  delay: number;
  /** Seconds the speech bubble stays hidden between lines. */
  gap: number;
  lines: string[];
  /** Resting position (percent) when motion is reduced. */
  rest: string;
};

const STROLLERS: Stroller[] = [
  {
    look: { skin: "#c68642", hair: "#2a2a27", hairStyle: "short", shirt: "#b5765a" },
    pants: "#2f3a44",
    worker: true,
    dir: "right",
    dur: 34,
    delay: 0,
    gap: 11,
    lines: [
      "First place that doesn't charge me for dead leads.",
      "Headed to a job on Garfield.",
    ],
    rest: "16%",
  },
  {
    look: { skin: "#d99a6c", hair: "#5b4636", hairStyle: "long", shirt: "#6b8e5a" },
    pants: "#46403a",
    dir: "left",
    dur: 44,
    delay: 5,
    gap: 12,
    lines: ["Marco fixed our radiator on a Sunday.", "Now I just ask the block."],
    rest: "68%",
  },
  {
    look: { skin: "#e0a87e", hair: "#2a2a27", hairStyle: "curly", shirt: "#c24f37" },
    pants: "#37322e",
    dir: "right",
    dur: 52,
    delay: 15,
    gap: 14,
    lines: ["Anyone know a good electrician?", "The block always knows someone."],
    rest: "44%",
  },
];

function SpeechBubble({ text }: { text: string }) {
  return (
    <m.div
      className="absolute bottom-full left-1/2 mb-1 w-max max-w-[180px] -translate-x-1/2"
      initial={{ opacity: 0, y: 6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <div className="relative rounded-2xl border border-cream-200 bg-cream-50 px-3 py-1.5 text-center font-ui text-[12px] font-medium leading-snug text-ink-800 shadow-stoop">
        {text}
        <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-cream-200 bg-cream-50" />
      </div>
    </m.div>
  );
}

function Stroller({ s, reduce }: { s: Stroller; reduce: boolean }) {
  const [line, setLine] = useState<string | null>(null);
  const facingLeft = s.dir === "left";

  useEffect(() => {
    if (reduce) {
      setLine(null);
      return;
    }
    let i = 0;
    let visible = false;
    const timers: number[] = [];
    const loop = () => {
      visible = !visible;
      if (visible) {
        setLine(s.lines[i % s.lines.length]);
        i += 1;
        timers.push(window.setTimeout(loop, 3600));
      } else {
        setLine(null);
        timers.push(window.setTimeout(loop, s.gap * 1000));
      }
    };
    timers.push(window.setTimeout(loop, s.delay * 1000 + 1800));
    return () => timers.forEach(clearTimeout);
  }, [reduce, s]);

  const from = s.dir === "right" ? "-10%" : "100%";
  const to = s.dir === "right" ? "100%" : "-10%";

  return (
    <m.div
      className="absolute bottom-0"
      initial={{ left: from }}
      animate={reduce ? { left: s.rest } : { left: [from, to] }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: s.dur, repeat: Infinity, ease: "linear", delay: s.delay }
      }
    >
      <div className="relative">
        <AnimatePresence>
          {line && <SpeechBubble key={line} text={line} />}
        </AnimatePresence>
        <div style={facingLeft ? { transform: "scaleX(-1)" } : undefined}>
          <Walker
            look={s.look}
            worker={s.worker}
            pants={s.pants}
            className="h-[66px] w-auto sm:h-[92px]"
          />
        </div>
      </div>
    </m.div>
  );
}

/**
 * Neighbors strolling the sidewalk in front of the block, dropping the
 * occasional line. Decorative, so the layer ignores pointer events and the
 * brownstones keep their cursor glow. When motion is reduced they stand still.
 */
export function StreetLife() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-[3px] z-[2] mx-auto h-0 max-w-7xl px-2"
    >
      {STROLLERS.map((s, i) => (
        <Stroller key={i} s={s} reduce={!!reduce} />
      ))}
    </div>
  );
}
