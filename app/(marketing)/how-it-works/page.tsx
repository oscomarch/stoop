import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TRADES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Stoop matches Brooklyn homeowners with vetted local pros. Post a job, get bids, pay through escrow, leave a review your neighbors will see.",
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
          Most home-services platforms are matchmakers. They take a finder&apos;s
          fee and disappear. Stoop is different. We hold the money, tie the
          reviews to the block, and stick around for the whole job.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <ol className="space-y-12">
          <Step
            number="01"
            title="Post the job in about a minute."
            body={
              <>
                Pick a trade. Snap a photo. Describe what&apos;s broken or what
                you want. Set a budget range if you can (optional, but it helps
                pros say yes faster). Pick your urgency: flexible, this week, or ASAP.
              </>
            }
            example="Example: &quot;Bathroom radiator hissing constantly. Pre-war building, original cast iron. Photo attached. Budget $150 to $300. This week.&quot;"
          />
          <Step
            number="02"
            title="Vetted pros nearby send bids."
            body={
              <>
                Every Stoop pro is verified before they can bid. We check their
                license number, their insurance carrier, and their identity. They
                see your job, send a price and a short message, and tell you
                when they can come. You see their profile, their work history,
                and reviews from your <em>actual neighbors</em>.
              </>
            }
            example="You usually see 3 to 5 bids within a day. Pick the one you trust, not just the cheapest."
          />
          <Step
            number="03"
            title="Pay through escrow. Safely."
            body={
              <>
                When you accept a bid, you fund escrow with a credit card or
                bank transfer. The pro shows up knowing the money is already
                there. You release it when the job is done to your satisfaction.
              </>
            }
            example="No cash up front. No surprise charges at the end. If something goes wrong, disputes go through Stoop, not your insurance company."
          />
          <Step
            number="04"
            title="Leave a review your block will see."
            body={
              <>
                When the work is done, leave an honest review. We tie it to your
                address, so the next person nearby who looks up that pro sees
                your review at the top, ranked by physical distance.
              </>
            }
            example="&quot;Sarah from 2 doors down on Garfield Pl&quot; beats &quot;Sarah from 4 miles away&quot; every time."
          />
        </ol>
      </section>

      <section className="bg-cream-100">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
            What you can hire for at launch.
          </h2>
          <p className="mt-3 text-lg text-ink-600">
            We&apos;re starting with the five trades that cover about 80% of brownstone
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
          Ready to put some trust back into hiring a pro?
        </h2>
        <p className="mt-3 text-lg text-ink-600">
          We&apos;re launching block by block, Brooklyn first.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="xl">
            <Link href="/#waitlist">Join the waitlist</Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/for-tradespeople">I work in the trades</Link>
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
          <p
            className="mt-3 rounded-xl border border-ink-200 bg-cream-100 p-4 text-sm text-ink-600"
            dangerouslySetInnerHTML={{ __html: example }}
          />
        )}
      </div>
    </li>
  );
}
