"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowRight, Lock, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Brownstone, StreetTree, type BrownstoneTone } from "@/components/brand/art";
import { Marquee } from "./motion";

const HEADLINE = ["Hire", "the", "pro", "your", "block", "already", "trusts."];
const HIGHLIGHT = "block";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const BLOCK: { tone: BrownstoneTone; h: string; tree?: boolean }[] = [
  { tone: "rust", h: "86%" },
  { tone: "brick", h: "100%" },
  { tone: "clay", h: "92%" },
  { tone: "limestone", h: "97%", tree: true },
  { tone: "ink", h: "103%" },
  { tone: "brick", h: "88%" },
  { tone: "rust", h: "95%" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const blockY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const blockScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06]);

  return (
    <section ref={ref} className="grain-overlay relative overflow-hidden bg-cream-50">
      <div className="relative z-[2] mx-auto max-w-6xl px-6 pt-16 text-center md:pt-24">
        <motion.div
          variants={fadeUp}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-terracotta-200 bg-terracotta-50 px-3 py-1 text-sm font-medium text-terracotta-800"
        >
          <MapPin className="h-3.5 w-3.5" />
          Starting on the brownstone blocks of Brooklyn
        </motion.div>

        <motion.h1
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto max-w-4xl font-serif text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance sm:text-6xl md:text-7xl"
        >
          {HEADLINE.map((w, i) => (
            <motion.span key={i} variants={word} className="inline-block">
              {w === HIGHLIGHT ? (
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 italic text-terracotta-700">{w}</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-[-2px] bottom-[0.1em] z-0 h-[0.3em] -rotate-1 bg-terracotta-200/80"
                  />
                </span>
              ) : (
                w
              )}
              {"\u00A0"}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={0.45}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink-600 text-pretty md:text-xl"
        >
          Post a job. Local pros send sealed bids, so you see honest prices
          instead of a race to call you first. And every review comes from a
          real neighbor, the closest ones first.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={0.6}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="xl" className="w-full sm:w-auto">
            <Link href="#waitlist">
              Join the waitlist
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
            <Link href="/for-tradespeople">I work in the trades</Link>
          </Button>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={0.75}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-5 text-sm text-ink-500"
        >
          Free for homeowners. No cold-lead fees for pros.
        </motion.p>
      </div>

      {/* The block */}
      <div className="relative z-[1] mt-12 md:mt-16">
        <FloatingChips />
        <motion.div
          style={{ y: blockY, scale: blockScale }}
          className="relative mx-auto flex h-[220px] max-w-7xl items-end justify-center gap-[1.5%] px-2 sm:h-[300px] md:h-[400px]"
        >
          {BLOCK.map((b, i) => (
            <div key={i} className="flex h-full items-end" style={{ height: b.h }}>
              {b.tree && <StreetTree className="h-[55%] w-auto self-end" />}
              <Brownstone tone={b.tone} className="h-full w-auto" />
            </div>
          ))}
        </motion.div>
        {/* sidewalk */}
        <div className="h-3 w-full bg-ink-900/90" />
      </div>

      <div className="relative z-[2] border-y border-ink-900/10 bg-ink-900 py-3.5 text-cream-50">
        <Marquee>
          {["Sealed bids", "No cold-lead fees", "Reviews from your block", "Escrow on every job", "No ghosting", "Brooklyn first"].map(
            (t) => (
              <span key={t} className="flex items-center gap-3 px-6 text-sm font-medium tracking-wide">
                {t}
                <StoopDot />
              </span>
            )
          )}
        </Marquee>
      </div>
    </section>
  );
}

function StoopDot() {
  return <span className="inline-block h-1.5 w-1.5 rotate-45 bg-terracotta-500" aria-hidden />;
}

function FloatingChips() {
  const reduce = useReducedMotion();
  const float = (delay: number) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -10, 0] },
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
        };
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[3] mx-auto hidden max-w-5xl px-6 md:block">
      <motion.div
        {...float(0)}
        className="absolute left-2 top-6 flex items-center gap-2 rounded-xl border border-ink-200 bg-cream-50/95 px-3 py-2 text-sm shadow-stoop backdrop-blur"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-900 text-cream-50">
          <Lock className="h-3.5 w-3.5" />
        </span>
        <span className="font-medium text-ink-800">Sealed bid, revealed at close</span>
      </motion.div>

      <motion.div
        {...float(1.2)}
        className="absolute right-2 top-16 flex items-center gap-2 rounded-xl border border-ink-200 bg-cream-50/95 px-3 py-2 text-sm shadow-stoop backdrop-blur"
      >
        <span className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-terracotta-500 text-terracotta-500" />
          ))}
        </span>
        <span className="font-medium text-ink-800">Sarah, 2 doors down</span>
      </motion.div>
    </div>
  );
}
