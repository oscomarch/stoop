import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  FileText,
  Hammer,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "For tradespeople",
  description:
    "Stoop is the no-cold-lead-fee platform for working pros in Brooklyn. Bid for free, get paid through escrow, and run your business from one place.",
};

const features = [
  {
    icon: Hammer,
    title: "Bid for free. Always.",
    body: "No $2,400/month subscription. No per-lead charges for jobs that ghost you. We make money only when you actually book the job.",
  },
  {
    icon: ShieldCheck,
    title: "Pre-funded escrow.",
    body: "The customer's money is already with Stoop before you walk through the door. Get paid the day the job is done.",
  },
  {
    icon: FileText,
    title: "Invoices & receipts done.",
    body: "Every booked job auto-generates a clean invoice with your business name on it. CSV export for your accountant.",
  },
  {
    icon: Calendar,
    title: "Schedule, in one place.",
    body: "Bids, accepted jobs, and confirmed appointments in one calendar. Automatic SMS reminders to your customers.",
  },
  {
    icon: MessageSquare,
    title: "Built-in messaging.",
    body: "No more giving out your personal cell. Stoop messaging keeps your number private and saves a full record.",
  },
  {
    icon: CreditCard,
    title: "Tax-ready earnings.",
    body: "Quarterly summaries of revenue, deductible Stoop fees, and 1099 prep when you hit the threshold.",
  },
];

const pricing = [
  {
    label: "Per booked job",
    value: "12%",
    description:
      "Charged to you only on jobs the platform helped you win. No fees on repeat business with the same customer after the first job.",
  },
  {
    label: "Listing & bidding",
    value: "Free",
    description: "Browse jobs nearby and submit unlimited bids at no cost.",
  },
  {
    label: "Payment processing",
    value: "Included",
    description:
      "Card and ACH fees are baked into the platform fee. No separate Stripe charges to figure out.",
  },
  {
    label: "Subscription",
    value: "$0",
    description:
      "No monthly subscription. Ever. The 12% is the only number you have to remember.",
  },
];

export default function ForTradespeoplePage() {
  return (
    <div className="bg-cream-50">
      <section className="mx-auto max-w-4xl px-6 py-24">
        <Badge variant="default" className="mb-6">
          For working pros
        </Badge>
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-ink-900 text-balance md:text-6xl">
          The platform that doesn&apos;t monetize your confusion.
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-ink-600 text-pretty">
          You shouldn&apos;t have to pay $40 a lead to talk to someone who never
          answers. You shouldn&apos;t have to chase a customer for payment three weeks
          after the job is done. Stoop fixes both.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="xl">
            <Link href="/#waitlist">Apply to join</Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <a href="mailto:hello@stoop.app?subject=Tradesperson%20inquiry">
              Talk to a human
            </a>
          </Button>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
            One place to run your business.
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-600">
            Most lead-gen platforms drop a job on your desk and walk away. Stoop
            sticks around — through messaging, scheduling, payment, and the
            paperwork after.
          </p>

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li
                key={f.title}
                className="rounded-2xl border border-ink-200 bg-cream-50 p-6"
              >
                <f.icon className="h-6 w-6 text-terracotta-600" />
                <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight text-ink-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
          Pricing, no surprises.
        </h2>
        <p className="mt-3 text-lg text-ink-600">
          One number to remember. No subscriptions, no per-lead fees.
        </p>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          {pricing.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl border border-ink-200 bg-cream-50 p-6"
            >
              <dt className="text-sm font-medium uppercase tracking-wider text-ink-500">
                {p.label}
              </dt>
              <dd className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink-900">
                {p.value}
              </dd>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {p.description}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm text-ink-500">
          Pricing is provisional and may change before launch. We&apos;ll always
          give 30 days notice and grandfather active jobs at the old rate.
        </p>
      </section>

      <section className="bg-terracotta-700 py-20 text-cream-50">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Verification matters.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream-100">
            Every pro on Stoop is verified before they can bid. We check your
            license number, your insurance carrier, your business name, and run
            an identity check. The badge isn&apos;t cosmetic — it&apos;s the platform&apos;s
            backbone.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="xl"
              className="bg-cream-50 text-terracotta-800 hover:bg-cream-100"
            >
              <Link href="/#waitlist">Start your application</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
