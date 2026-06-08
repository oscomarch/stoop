import Link from "next/link";
import { ArrowRight, Calendar, FileText, ShieldCheck, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "./motion";

const benefits = [
  {
    icon: Wallet,
    title: "Free to bid",
    body: "Bid on local jobs for free. We take a small cut only when you actually win the work.",
  },
  {
    icon: FileText,
    title: "Invoices built in",
    body: "Every job keeps a clean record. Your accountant will thank you.",
  },
  {
    icon: Calendar,
    title: "One calendar",
    body: "Jobs, bids, and appointments in one place. Client reminders go out by text on their own.",
  },
  {
    icon: ShieldCheck,
    title: "Paid, not chasing",
    body: "Escrow holds the money before you show up. No chasing payment after the work is done.",
  },
];

export function TradespersonCta() {
  return (
    <section className="grain-overlay relative overflow-hidden bg-terracotta-700 py-24 text-cream-50">
      <div className="relative z-[2] mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-cream-200">
              For pros
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-cream-50 text-balance md:text-5xl">
              Built for the people doing the work.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream-100 text-pretty">
              Find jobs on your block. Get paid through escrow. Run the boring
              parts from one place. No cold-lead fees. No race to the bottom.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" variant="secondary">
                <Link href="/for-tradespeople">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" className="bg-cream-50 text-terracotta-800 hover:bg-cream-100">
                <Link href="#waitlist">Apply to join</Link>
              </Button>
            </div>
          </Reveal>

          <Stagger className="grid gap-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <StaggerItem key={b.title} className="h-full">
                <div className="h-full rounded-2xl border border-cream-50/15 bg-cream-50/5 p-5">
                  <b.icon className="h-6 w-6 text-cream-200" />
                  <h3 className="mt-4 font-serif text-lg font-semibold text-cream-50">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-200">{b.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
