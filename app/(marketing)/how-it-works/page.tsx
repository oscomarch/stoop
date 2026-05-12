import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TRADES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Stoop matches Brooklyn homeowners with neighborhood-vetted tradespeople — post a job, get bids, pay through escrow, leave a neighbor-trust review.",
};

export default function HowItWorksPage() {
  return (
    <div className="bg-cream-50">
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-700">
          How Stoop works
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-ink-900 text-balance md:text-6xl">
          One marketplace. Four moving parts. Zero gambling.
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-ink-600 text-pretty">
          Most home-services platforms are matchmakers. They take a finder&apos;s fee
          and disappear. Stoop is different — we hold the money, anchor the
          reviews to the block, and stick around for the whole job.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <ol className="space-y-12">
          <Step
            number="01"
            title="Post the job in 60 seconds."
            body={
              <>
                Pick a trade. Snap a photo. Describe what&apos;s broken or what you
                want. Set a budget range (optional, but it helps pros say yes
                faster). Pick your urgency: flexible, this week, or ASAP.
              </>
            }
            example="Example: 'Bathroom radiator hissing constantly. Pre-war building, original cast iron. Photo attached. Budget $150-300. This week.'"
          />
          <Step
            number="02"
            title="Vetted pros nearby bid on your job."
            body={
              <>
                Every Stoop pro is verified — license number, insurance carrier,
                and identity all checked before they can bid. They see your job,
                send a price and a short message, and tell you when they can
                come. You see their profile, their work history, and reviews
                from your <em>actual neighbors</em>.
              </>
            }
            example="You usually get 3–5 bids within a day. Pick the one you trust, not just the cheapest."
          />
          <Step
            number="03"
            title="Pay through escrow. Safely."
            body={
              <>
                When you accept a bid, you fund escrow with a credit card or
                bank transfer. The pro shows up knowing the money is already
                there. You release the money only when the job is done to your
                satisfaction.
              </>
            }
            example="No cash up front. No surprise charges. Disputes go through Stoop, not your insurance company."
          />
          <Step
            number="04"
            title="Leave a review your neighbors will see first."
            body={
              <>
                When the work is done, leave an honest review. We anchor it to
                your block, so the next person who looks up that pro from your
                neighborhood sees your review at the top — ranked by physical
                distance from them.
              </>
            }
            example="'Sarah from 2 doors down on Garfield Pl' beats 'Sarah from 4 miles away' every time."
          />
        </ol>
      </section>

      <section className="bg-cream-100">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
            What you can hire for at launch.
          </h2>
          <p className="mt-3 text-lg text-ink-600">
            We&apos;re starting with the five trades that cover ~80% of brownstone
            home maintenance.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {TRADES.map((t) => (
              <li
                key={t.id}
                className="flex items-start gap-3 rounded-xl border border-ink-200 bg-cream-50 p-4"
              >
                <span className="text-2xl" aria-hidden>
                  {t.emoji}
                </span>
                <div>
                  <p className="font-medium text-ink-900">{t.label}</p>
                  <p className="text-sm text-ink-600">{t.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
          Ready to put trust back into hiring a pro?
        </h2>
        <p className="mt-3 text-lg text-ink-600">
          We&apos;re launching block by block, Brooklyn first.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="xl">
            <Link href="/#waitlist">Join the waitlist</Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/for-tradespeople">I&apos;m a tradesperson</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Step({
  number,
  title,
  body,
  example,
}: {
  number: string;
  title: string;
  body: React.ReactNode;
  example?: string;
}) {
  return (
    <li className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-10">
      <span
        className="font-serif text-7xl font-light leading-none text-terracotta-300"
        aria-hidden
      >
        {number}
      </span>
      <div>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-700 text-pretty">
          {body}
        </p>
        {example && (
          <p className="mt-3 rounded-xl border border-ink-200 bg-cream-100 p-4 text-sm text-ink-600">
            {example}
          </p>
        )}
      </div>
    </li>
  );
}
