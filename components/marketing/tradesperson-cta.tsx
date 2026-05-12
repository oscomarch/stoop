import Link from "next/link";
import { ArrowRight, Calendar, FileText, ShieldCheck, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Wallet,
    title: "Free leads, not pay-per-cold-call",
    body: "Bid on jobs in your area for free. We take a small cut when the job actually closes, and only from work the platform helped you win.",
  },
  {
    icon: FileText,
    title: "Invoicing and receipts, built in",
    body: "Stop juggling spreadsheets and PDF invoices. Every job comes with a clean record your accountant will love.",
  },
  {
    icon: Calendar,
    title: "A calendar that fits your day",
    body: "All your jobs, bids, and confirmed appointments in one place. SMS reminders to clients go out automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Get paid, guaranteed",
    body: "Escrow holds the customer's money before you show up. No more chasing payment after the work is done.",
  },
];

export function TradespersonCta() {
  return (
    <section className="bg-terracotta-700 py-24 text-cream-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cream-200">
              For pros
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-cream-50 text-balance md:text-5xl">
              A platform that doesn&apos;t take 30% and call it a feature.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream-100 text-pretty">
              Stoop is built for working pros. Find clients on your block, get
              paid through escrow, run your business from one place. No
              cold-lead fees. No race-to-the-bottom auctions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" variant="secondary">
                <Link href="/for-tradespeople">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                className="bg-cream-50 text-terracotta-800 hover:bg-cream-100"
              >
                <Link href="#waitlist">Apply to join</Link>
              </Button>
            </div>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <li
                key={b.title}
                className="rounded-2xl border border-cream-50/15 bg-cream-50/5 p-5"
              >
                <b.icon className="h-6 w-6 text-cream-200" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-cream-50">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-200">
                  {b.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
