import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-50">
      {/* Decorative brownstone silhouette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-terracotta-700) 0 64px, transparent 64px 96px)",
          maskImage:
            "linear-gradient(to top, black, transparent), linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "linear-gradient(to top, black, transparent), linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="moss" className="mb-6 inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            Launching in Brooklyn brownstone neighborhoods
          </Badge>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-ink-900 text-balance md:text-7xl">
            Find a tradesperson the way you&apos;d find a{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">babysitter</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-terracotta-200/80 md:h-4"
              />
            </span>
            .
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-ink-600 text-pretty md:text-xl">
            Stoop is the neighborhood marketplace for home services. Post a
            job, get bids from vetted pros on your block, pay safely through
            escrow. Reviews from your actual neighbors — ranked by how close
            they live to you.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href="#waitlist">
                Join the waitlist
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="w-full sm:w-auto"
            >
              <Link href="/for-tradespeople">I&apos;m a tradesperson</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-ink-500">
            Free to homeowners. No spam, no auto-dialers. Tradespeople, no cold-lead fees.
          </p>
        </div>
      </div>
    </section>
  );
}
