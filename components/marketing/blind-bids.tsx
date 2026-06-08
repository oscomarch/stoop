"use client";

import { m, useReducedMotion } from "motion/react";
import { Camera, Lock, ShieldCheck, Users } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "./motion";
import { cn } from "@/lib/utils";

type Bid = { name: string; price: string; note: string };

const BIDS: Bid[] = [
  { name: "Marco P.", price: "$280", note: "starts Tue" },
  { name: "Lena V.", price: "$340", note: "starts Mon" },
  { name: "Otis B.", price: "$310", note: "this week" },
  { name: "Dani R.", price: "$295", note: "starts Thu" },
  { name: "Sam K.", price: "$360", note: "tomorrow" },
];

const STEPS = [
  {
    icon: Camera,
    title: "Post the job",
    body: "A photo, a few words, your block. About a minute.",
  },
  {
    icon: Lock,
    title: "Pros bid sealed",
    body: "Up to five local pros send a price. None of them can see the others.",
  },
  {
    icon: Users,
    title: "Compare and hire",
    body: "Bids open together. Read their work and their neighbor reviews, then choose.",
  },
  {
    icon: ShieldCheck,
    title: "Pay through escrow",
    body: "Your money waits with Stoop until the work is done and you sign off.",
  },
];

export function BlindBids() {
  return (
    <section id="how" className="bg-cream-50 py-24">
      <div
        aria-hidden
        className="mx-auto mb-16 flex max-w-[200px] items-center gap-3 px-6"
      >
        <span className="h-px flex-1 bg-ink-200" />
        <span className="h-1.5 w-1.5 rotate-45 bg-terracotta-500" />
        <span className="h-px flex-1 bg-ink-200" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-terracotta-700">
            How a job works
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 text-balance md:text-5xl">
            Five sealed bids, opened together.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-600 text-pretty">
            No pro sees what the others bid. So you get real prices, not a dollar
            under whoever called you first.
          </p>
        </Reveal>

        {/* The reveal stage */}
        <div className="mt-14 rounded-3xl border border-ink-200 bg-cream-100 p-6 md:p-10">
          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            {BIDS.map((bid, i) => (
              <BidCard key={bid.name} bid={bid} index={i} />
            ))}
          </div>
          <Reveal delay={0.9} className="mt-8 text-center">
            <p className="text-sm text-ink-500">
              All five open the moment the window closes. You pick the one you
              trust, not just the cheapest.
            </p>
          </Reveal>
        </div>

        {/* Steps */}
        <Stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-cream-50">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-2xl font-light tracking-tight text-terracotta-400">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function BidCard({ bid, index }: { bid: Bid; index: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="h-44 w-[150px] [perspective:1200px] sm:w-40">
      <m.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        initial={reduce ? false : { rotateY: 0 }}
        whileInView={{ rotateY: 180 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.8, delay: 0.2 + index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Sealed face */}
        <Face className="items-center justify-center gap-3 bg-ink-900 text-cream-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-50/25">
            <Lock className="h-5 w-5" />
          </span>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-cream-300">
            Sealed
          </span>
          <span className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-cream-50/40" />
            ))}
          </span>
        </Face>

        {/* Revealed face */}
        <Face className="[transform:rotateY(180deg)] items-start justify-between bg-cream-50 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-100 text-sm font-semibold text-terracotta-700">
              {bid.name[0]}
            </span>
            <div className="leading-tight">
              <p className="font-ui text-sm font-semibold text-ink-900">{bid.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-moss-600">
                Verified pro
              </p>
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-ink-900">
              {bid.price}
            </p>
            <p className="text-xs text-ink-500">{bid.note}</p>
          </div>
        </Face>
      </m.div>
    </div>
  );
}

function Face({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col rounded-2xl border border-ink-200 shadow-stoop [backface-visibility:hidden]",
        className
      )}
    >
      {children}
    </div>
  );
}
