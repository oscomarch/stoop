"use client";

import { useEffect, useRef, useState } from "react";
import { m as M, useInView, useReducedMotion } from "motion/react";

import { Neighbor, type NeighborLook } from "@/components/brand/people";

type Side = "left" | "right";

type Message = {
  id: number;
  from: string;
  sub?: string;
  side: Side;
  look: NeighborLook;
  bg: string;
  text: string;
};

const DANA: NeighborLook = {
  skin: "#d99a6c",
  hair: "#5b4636",
  hairStyle: "long",
  shirt: "#5f8294",
};
const SARAH: NeighborLook = {
  skin: "#f0c8a0",
  hair: "#7a3b2a",
  hairStyle: "bun",
  shirt: "#6b8e5a",
};
const DEVON: NeighborLook = {
  skin: "#8d5524",
  hair: "#2a2a27",
  hairStyle: "curly",
  shirt: "#cfa056",
};

const MESSAGES: Message[] = [
  {
    id: 0,
    from: "Dana",
    side: "right",
    look: DANA,
    bg: "#e8eef1",
    text: "Anyone have a plumber they actually trust?",
  },
  {
    id: 1,
    from: "Sarah",
    sub: "Garfield Pl",
    side: "left",
    look: SARAH,
    bg: "#e7eee1",
    text: "Marco. Fixed our radiator on a Sunday.",
  },
  {
    id: 2,
    from: "Devon",
    sub: "Garfield Pl",
    side: "left",
    look: DEVON,
    bg: "#f3ead6",
    text: "Second him. No surprises at the end.",
  },
  {
    id: 3,
    from: "Dana",
    side: "right",
    look: DANA,
    bg: "#e8eef1",
    text: "Booking him now. Thanks, block.",
  },
];

function Avatar({
  look,
  bg,
  size = 44,
}: {
  look: NeighborLook;
  bg: string;
  size?: number;
}) {
  return (
    <span
      className="block shrink-0 overflow-hidden rounded-full ring-2 ring-cream-50"
      style={{ width: size, height: size, background: bg }}
    >
      <Neighbor look={look} className="h-full w-full" />
    </span>
  );
}

function Bubble({ m, reduce }: { m: Message; reduce: boolean }) {
  const left = m.side === "left";
  return (
    <M.li
      className={`flex items-end gap-2.5 ${left ? "justify-start" : "justify-end"}`}
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 440, damping: 32, mass: 0.7 }}
    >
      {left && <Avatar look={m.look} bg={m.bg} />}
      <div className={`max-w-[78%] ${left ? "" : "text-right"}`}>
        {left && (
          <p className="mb-1 pl-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-400">
            {m.from}
            {m.sub ? ` · ${m.sub}` : ""}
          </p>
        )}
        <div
          className={
            left
              ? "rounded-2xl rounded-bl-md bg-cream-100 px-4 py-2.5 text-left text-[15px] leading-snug text-ink-800"
              : "rounded-2xl rounded-br-md bg-terracotta-600 px-4 py-2.5 text-left text-[15px] leading-snug text-cream-50"
          }
        >
          {m.text}
        </div>
      </div>
      {!left && <Avatar look={m.look} bg={m.bg} />}
    </M.li>
  );
}

function Typing({ m }: { m: Message }) {
  return (
    <M.li
      className="flex items-end gap-2.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Avatar look={m.look} bg={m.bg} />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-cream-100 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <M.span
            key={i}
            className="block size-1.5 rounded-full bg-ink-400"
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </M.li>
  );
}

export function StoopChat({ autoplay = false }: { autoplay?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const active = autoplay || inView;

  useEffect(() => {
    if (reduce) {
      setCount(MESSAGES.length);
      return;
    }
    if (!active || count >= MESSAGES.length) {
      setTyping(false);
      return;
    }
    const msg = MESSAGES[count];
    const isReply = msg.side === "left";
    if (isReply) setTyping(true);
    const delay = count === 0 ? 450 : isReply ? 1000 : 700;
    const t = setTimeout(() => {
      setTyping(false);
      setCount((c) => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [active, reduce, count]);

  const nextIsReply =
    count < MESSAGES.length && MESSAGES[count].side === "left";

  return (
    <section className="relative overflow-hidden bg-cream-50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-terracotta-700">
          Ask your stoop
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
          The block already knows who to call.
        </h2>
        <p className="mt-4 max-w-lg text-pretty text-lg text-ink-600">
          Hiring used to start with a guess. Now it starts with a question to
          your block, answered by the neighbors who actually used the person.
        </p>

        <div
          ref={ref}
          className="mt-10 rounded-[28px] border border-cream-200 bg-[#fffdf9] p-4 shadow-stoop sm:p-6"
        >
          <header className="flex items-center gap-3 border-b border-cream-200 pb-4">
            <div className="flex -space-x-2.5">
              <Avatar look={DANA} bg="#e8eef1" size={32} />
              <Avatar look={SARAH} bg="#e7eee1" size={32} />
              <Avatar look={DEVON} bg="#f3ead6" size={32} />
            </div>
            <div>
              <p className="font-ui text-sm font-semibold text-ink-900">
                Garfield Pl
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-400">
                12 neighbors
              </p>
            </div>
          </header>

          <ul className="mt-5 flex flex-col gap-4">
            {MESSAGES.slice(0, count).map((m) => (
              <Bubble key={m.id} m={m} reduce={!!reduce} />
            ))}
            {typing && nextIsReply && <Typing m={MESSAGES[count]} />}
          </ul>
        </div>
      </div>
    </section>
  );
}
