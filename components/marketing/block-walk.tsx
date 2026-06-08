"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";

import { Brownstone, type BrownstoneTone } from "@/components/brand/art";

type Stop = {
  distance: string;
  closest?: boolean;
  stars: number;
  quote: string;
  name: string;
  street: string;
  tone: BrownstoneTone;
};

const STOPS: Stop[] = [
  {
    distance: "Next door",
    closest: true,
    stars: 5,
    quote:
      "Fixed our radiator on a Sunday. Honest, fast, clean. His number lives on our fridge now.",
    name: "Sarah K.",
    street: "Garfield Pl",
    tone: "brick",
  },
  {
    distance: "Two doors down",
    stars: 5,
    quote: "Patched a ceiling leak we'd ignored for a year. Showed me every step as he went.",
    name: "Devon R.",
    street: "Garfield Pl",
    tone: "clay",
  },
  {
    distance: "Across the street",
    stars: 5,
    quote: "Redid our bathroom fixtures. Came back to fix a small wobble and wouldn't take a dime.",
    name: "Aliyah J.",
    street: "Garfield Pl",
    tone: "rust",
  },
  {
    distance: "One block away",
    stars: 4,
    quote: "Swapped the water heater the same week I called. Fair price, no surprises at the end.",
    name: "Tom & Rae",
    street: "Carroll St",
    tone: "limestone",
  },
  {
    distance: "Three blocks away",
    stars: 5,
    quote: "Found the real problem instead of selling me a new unit. That kind of honest is rare.",
    name: "Priya M.",
    street: "President St",
    tone: "ink",
  },
];

export function BlockWalk() {
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pin only on real desktop widths; phones get a native swipe carousel.
  if (!isDesktop || reduce) return <BlockWalkStatic />;
  return <BlockWalkPinned />;
}

/* --- Shared bits --------------------------------------------------------- */

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < n
              ? "h-4 w-4 fill-terracotta-500 text-terracotta-500"
              : "h-4 w-4 text-ink-200"
          }
        />
      ))}
    </span>
  );
}

function ReviewStop({ stop }: { stop: Stop }) {
  return (
    <div className="flex w-[80vw] max-w-[360px] shrink-0 flex-col items-center justify-end md:w-[380px]">
      <div className="w-full rounded-2xl border border-ink-200 bg-cream-50 p-5 shadow-stoop">
        <div className="flex items-center justify-between">
          <span
            className={
              stop.closest
                ? "rounded-full bg-moss-500/15 px-2.5 py-0.5 text-xs font-semibold text-moss-600"
                : "rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600"
            }
          >
            {stop.distance}
          </span>
          <Stars n={stop.stars} />
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-800">
          &ldquo;{stop.quote}&rdquo;
        </p>
        <p className="mt-3 text-sm text-ink-500">
          {stop.name}, {stop.street}
        </p>
      </div>
      <div className="mt-5 h-[190px] md:h-[250px]">
        <Brownstone tone={stop.tone} className="h-full w-auto" />
      </div>
    </div>
  );
}

function IntroPanel() {
  return (
    <div className="flex w-[88vw] max-w-[640px] shrink-0 flex-col justify-center self-stretch pr-4">
      <h2 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-ink-900 md:text-7xl">
        The block <span className="italic text-terracotta-700">remembers</span>.
      </h2>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-600">
        Look up a pro and you see what your neighbors actually said about them.
        Closest homes first, since the people nearest you have the least reason
        to oversell.
      </p>
      <p className="mt-4 text-sm text-ink-400">Keep scrolling to walk the block.</p>
    </div>
  );
}

function OutroPanel() {
  return (
    <div className="flex w-[88vw] max-w-[560px] shrink-0 flex-col justify-center self-stretch pl-4">
      <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink-900 md:text-6xl">
        This is the part no one can fake.
      </h2>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-600">
        Yelp shows a star average from strangers. Google shows whoever paid the
        most. Stoop shows you the truth the people on your block already know.
      </p>
      <Link
        href="#how"
        className="mt-7 inline-flex items-center gap-1.5 font-medium text-terracotta-700 hover:text-terracotta-800"
      >
        See how a job works
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* --- Pinned (desktop, motion) ------------------------------------------- */

function BlockWalkPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [viewportH, setViewportH] = useState(800);

  useLayoutEffect(() => {
    const calc = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      setViewportH(window.innerHeight);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream-100"
      style={{ height: distance + viewportH }}
    >
      <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden pb-[9%]">
        {/* fixed context label */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-20 md:px-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-700">
            The neighbor-trust layer
          </p>
          <p className="hidden text-xs font-medium uppercase tracking-widest text-ink-400 sm:block">
            Marco&apos;s Plumbing, closest first
          </p>
        </div>

        {/* sidewalk line behind the houses */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[9%] z-0 h-3 bg-ink-900/85" />
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative z-10 flex items-end gap-8 px-[8vw] will-change-transform md:gap-12"
        >
          <IntroPanel />
          {STOPS.map((s) => (
            <ReviewStop key={s.name + s.street} stop={s} />
          ))}
          <OutroPanel />
        </motion.div>

        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 z-20 h-1 origin-left bg-terracotta-500"
        />
      </div>
    </section>
  );
}

/* --- Static (mobile + reduced motion) ----------------------------------- */

function BlockWalkStatic() {
  return (
    <section className="bg-cream-100 py-20">
      <div className="mx-auto max-w-xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-700">
          The neighbor-trust layer
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink-900">
          The block <span className="italic text-terracotta-700">remembers</span>.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-600">
          Look up a pro and you see what your neighbors actually said. Closest
          homes first, since the people nearest you have the least reason to
          oversell.
        </p>

        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none]">
          {STOPS.map((s) => (
            <div key={s.name + s.street} className="snap-center">
              <ReviewStop stop={s} />
            </div>
          ))}
        </div>

        <p className="mt-8 text-lg leading-relaxed text-ink-600">
          Yelp shows a star average from strangers. Google shows whoever paid
          the most. Stoop shows the truth the people on your block already know.
        </p>
      </div>
    </section>
  );
}
