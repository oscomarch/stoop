import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { PostJobForm } from "./post-job-form";
import { TRADES, type TradeId } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Post a job",
};

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ trade?: string }>;
}) {
  await requireRole("homeowner");
  const { trade } = await searchParams;

  const initialTrade = TRADES.find((t) => t.id === trade)?.id ?? "handyman";

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Post a job.
        </h1>
        <p className="mt-2 text-ink-600">
          We&apos;ll show it to verified pros near you. Most jobs see 3 to 5
          bids within a day.
        </p>
      </header>
      <PostJobForm initialTrade={initialTrade as TradeId} />
    </div>
  );
}
