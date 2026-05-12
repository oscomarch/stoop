import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "Why we're building Stoop. A trust-first home services marketplace that starts on the block.",
};

export default function ManifestoPage() {
  return (
    <article className="bg-cream-50 py-24">
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-700">
          Our manifesto
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-ink-900 text-balance md:text-6xl">
          Trust scales. Marketplaces don&apos;t.
        </h1>

        <div className="prose prose-lg mt-12 space-y-6 text-lg leading-relaxed text-ink-700">
          <p className="text-pretty">
            When you need a babysitter, you don&apos;t open Yelp. You ask the
            family two doors down. You ask the parent who&apos;s been on the
            block longer than you have. You trust them because they have
            something to lose if they steer you wrong.
          </p>

          <p className="text-pretty">
            That&apos;s how trust used to work for everything in your home: your
            plumber, your electrician, the guy who fixed the boiler. It worked
            because density was the trust mechanism. You couldn&apos;t hide on
            a block of 30 households.
          </p>

          <p className="text-pretty">
            The internet broke that. Yelp scraped your neighbors&apos; reviews
            and buried them under paid placements. Angi sold your job to four
            strangers for $87 a lead. Facebook Marketplace turned hiring a pro
            into a coin flip. Trust got abstracted into a five-star average and
            a blurry headshot.
          </p>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
            We&apos;re putting density back at the center.
          </h2>

          <p className="text-pretty">
            Stoop is a marketplace that pretends it isn&apos;t one. Every job
            goes to the pros nearest you. Every review is tied to the
            reviewer&apos;s street, ranked by physical distance. Every payment
            is held in escrow until the work is done. The platform exists to
            make trust portable: from your block, through your phone, to the
            right person at the right time.
          </p>

          <p className="text-pretty">
            We&apos;re starting in Brooklyn brownstone neighborhoods because
            they&apos;re the most ideal lab on earth for this. High
            homeownership. People know their neighbors. People talk on the
            stoop. Once it works here, it works anywhere there&apos;s a
            neighborhood worth living in.
          </p>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
            What we promise.
          </h2>

          <ul className="space-y-3 text-pretty">
            <li>
              <strong>To homeowners:</strong> we&apos;ll never sell your job to
              four strangers. We&apos;ll never run a paid placement that pushes
              a worse pro above a better one. If a pro screws up, the money is
              still with us.
            </li>
            <li>
              <strong>To pros:</strong> we&apos;ll never charge you for a cold
              lead. We&apos;ll never let a homeowner ghost you on payment.
              We&apos;ll build the back-office tools the lead-gen platforms
              refuse to.
            </li>
            <li>
              <strong>To both:</strong> we&apos;ll keep the platform simple,
              the pricing predictable, and the reviews honest. If we drift from
              that, you have the right to call us on it. And we expect you will.
            </li>
          </ul>

          <p className="text-pretty">
            Stoop is a small bet on something old: that the people who live
            near you are the best authority on who to trust with your home.
          </p>

          <p className="text-pretty">Welcome to the block.</p>
        </div>

        <div className="mt-16 border-t border-ink-200 pt-8">
          <p className="text-sm text-ink-500">
            The Stoop founders. Brooklyn, NY.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="xl">
            <Link href="/#waitlist">Get on the list</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
