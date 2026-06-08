"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  m,
  useScroll,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LivingBlock } from "@/components/brand/living-block";
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

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section ref={ref} className="grain-overlay relative overflow-hidden bg-cream-50">
      <div className="relative z-[2] mx-auto max-w-6xl px-6 pt-16 text-center md:pt-24">
        <m.div
          variants={fadeUp}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-terracotta-200 bg-terracotta-50 px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.14em] text-terracotta-800"
        >
          <MapPin className="h-3.5 w-3.5" />
          Starting on the brownstone blocks of Brooklyn
        </m.div>

        <m.h1
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto max-w-4xl font-serif text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance sm:text-6xl md:text-7xl"
        >
          {HEADLINE.map((w, i) => (
            <m.span key={i} variants={word} className="inline-block">
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
            </m.span>
          ))}
        </m.h1>

        <m.p
          variants={fadeUp}
          custom={0.45}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink-600 text-pretty md:text-xl"
        >
          Post a job. Local pros send sealed bids, so you see honest prices
          instead of a race to call you first. And every review comes from a
          real neighbor, the closest ones first.
        </m.p>

        <m.div
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
        </m.div>

        <m.p
          variants={fadeUp}
          custom={0.75}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mt-5 text-sm text-ink-500"
        >
          Free for homeowners. No cold-lead fees for pros.
        </m.p>
      </div>

      {/* The block */}
      <div className="relative z-[1] mt-12 md:mt-16">
        <LivingBlock progress={scrollYProgress} />
      </div>

      <div className="relative z-[2] border-y border-ink-900/10 bg-ink-900 py-3.5 text-cream-50">
        <Marquee>
          {["Sealed bids", "No cold-lead fees", "Reviews from your block", "Escrow on every job", "No ghosting", "Brooklyn first"].map(
            (t) => (
              <span key={t} className="flex items-center gap-3 px-6 font-mono text-xs font-medium uppercase tracking-[0.18em]">
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
