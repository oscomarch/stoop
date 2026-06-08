"use client";

import { useRef } from "react";
import {
  m,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type MotionStyle,
} from "motion/react";

import { Brownstone, StreetTree, type BrownstoneTone } from "./art";
import { StreetLife } from "./street-life";

type House = {
  tone: BrownstoneTone;
  variant: number;
  h: string;
  tree?: boolean;
};

// Seven elevations, each a different tone + facade variant so the row reads as
// a real block and not a repeated stamp.
const BLOCK: House[] = [
  { tone: "rust", variant: 5, h: "86%" },
  { tone: "brick", variant: 0, h: "100%" },
  { tone: "clay", variant: 2, h: "92%" },
  { tone: "limestone", variant: 1, h: "97%", tree: true },
  { tone: "ink", variant: 3, h: "103%" },
  { tone: "brick", variant: 4, h: "88%" },
  { tone: "rust", variant: 0, h: "95%" },
];

const DUSK_SKY =
  "linear-gradient(180deg, rgba(40,33,60,0) 0%, rgba(58,43,82,0.86) 42%, rgba(150,74,72,0.92) 72%, rgba(208,122,74,0.95) 100%)";

/**
 * The hero's block of brownstones, brought to life. Windows glow toward the
 * cursor like lights coming on as you walk past, the whole street eases into
 * dusk as you scroll, and a few houses smoke, flicker, and sway. Degrades to a
 * calm, evenly lit street when the visitor prefers reduced motion.
 */
export function LivingBlock({ progress }: { progress?: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);

  // Normalized cursor x across the row (0..1), or -1 when the cursor is away.
  const pointer = useMotionValue(-1);

  // Scroll drives the time of day. Fall back to a fixed evening if no progress
  // source is wired in.
  const internal = useMotionValue(0);
  const dusk = useTransform(progress ?? internal, [0, 0.8], [0, 1]);

  const blockY = useTransform(dusk, [0, 1], [0, reduce ? 0 : -70]);
  const blockScale = useTransform(dusk, [0, 1], [1, reduce ? 1 : 1.05]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    pointer.set((e.clientX - rect.left) / rect.width);
  }

  return (
    <div className="relative">
      {/* dusk sky, fading up from the rooftops */}
      <m.div
        aria-hidden
        style={{ opacity: reduce ? 0.5 : dusk }}
        className="pointer-events-none absolute inset-x-0 bottom-3 top-[-56px] z-0"
      >
        <div className="h-full w-full" style={{ background: DUSK_SKY }} />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "radial-gradient(60% 90% at 50% 100%, rgba(255,196,120,0.55), transparent 70%)",
          }}
        />
      </m.div>

      {/* the houses */}
      <m.div
        ref={rowRef}
        onPointerMove={onMove}
        onPointerLeave={() => pointer.set(-1)}
        style={{ y: blockY, scale: blockScale }}
        className="relative z-[1] mx-auto flex h-[220px] max-w-7xl items-end justify-center gap-[1.5%] px-2 sm:h-[300px] md:h-[400px]"
      >
        {BLOCK.map((house, i) => (
          <House
            key={i}
            house={house}
            index={i}
            count={BLOCK.length}
            pointer={pointer}
            dusk={dusk}
            reduce={!!reduce}
          />
        ))}
      </m.div>

      {/* neighbors strolling the sidewalk */}
      <StreetLife />

      {/* sidewalk */}
      <div className="relative z-[1] h-3 w-full bg-ink-900/90" />
    </div>
  );
}

function House({
  house,
  index,
  count,
  pointer,
  dusk,
  reduce,
}: {
  house: House;
  index: number;
  count: number;
  pointer: MotionValue<number>;
  dusk: MotionValue<number>;
  reduce: boolean;
}) {
  const cx = (index + 0.5) / count;

  // base + dusk lifts the whole street; cursor proximity pools warm light
  // around a couple of houses at a time.
  const lit = useTransform([pointer, dusk], ([p, d]: number[]) => {
    const prox = p < 0 ? 0 : Math.exp(-((p - cx) ** 2) / (2 * 0.12 ** 2));
    return Math.min(1, 0.26 + d * 0.62 + prox * 0.6);
  });

  const style = {
    height: house.h,
    "--lit": reduce ? 0.78 : lit,
  } as unknown as MotionStyle;

  return (
    <m.div style={style} className="flex h-full items-end">
      {house.tree && <StreetTree className="h-[55%] w-auto self-end" />}
      <Brownstone tone={house.tone} variant={house.variant} className="h-full w-auto" />
    </m.div>
  );
}
