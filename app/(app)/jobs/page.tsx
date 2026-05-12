import type { Metadata } from "next";
import { Filter } from "lucide-react";
import { desc, eq, and, inArray } from "drizzle-orm";

import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs, tradespersonProfiles } from "@/lib/db/schema";
import { JobCard } from "@/components/app/job-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TRADES, type TradeId } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Browse jobs",
};

export default async function JobsBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ trade?: string }>;
}) {
  const user = await requireRole("tradesperson");
  const { trade: tradeFilter } = await searchParams;

  const [profile] = await db
    .select()
    .from(tradespersonProfiles)
    .where(eq(tradespersonProfiles.userId, user.id))
    .limit(1);

  // Filter logic:
  // - If the user has trades in their profile, default to those.
  // - If a query string `?trade=...` is set, that overrides.
  // - Otherwise, show all trades.
  const profileTrades = (profile?.trades ?? []).filter((t): t is string => !!t);
  const tradeIds = TRADES.map((t) => t.id);
  const isValidTrade = (t: string): t is TradeId =>
    (tradeIds as string[]).includes(t);
  const effectiveTrades: TradeId[] = tradeFilter
    ? [tradeFilter].filter(isValidTrade)
    : profileTrades.length > 0
    ? profileTrades.filter(isValidTrade)
    : tradeIds;

  const openJobs = await db
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.status, "open"),
        inArray(jobs.trade, effectiveTrades)
      )
    )
    .orderBy(desc(jobs.createdAt))
    .limit(50);

  return (
    <div className="space-y-8">
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
            Jobs near you.
          </h1>
          <p className="mt-1 text-ink-600">
            {profileTrades.length > 0
              ? `Filtered to your trades: ${profileTrades
                  .map((t) => tradeLabelFor(t))
                  .join(", ")}.`
              : "Showing all trades. Add yours in your profile to filter."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Filter className="h-4 w-4" />
          <span>{openJobs.length} open</span>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2">
        <FilterPill href="/jobs" active={!tradeFilter}>
          All trades
        </FilterPill>
        {TRADES.map((t) => (
          <FilterPill
            key={t.id}
            href={`/jobs?trade=${t.id}`}
            active={tradeFilter === t.id}
          >
            <span aria-hidden>{t.emoji}</span> {t.label}
          </FilterPill>
        ))}
      </nav>

      {openJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-700">No open jobs match this filter right now.</p>
            <p className="mt-1 text-sm text-ink-500">
              We&apos;re actively seeding Brooklyn. Check back in a day or two.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {openJobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}

      <p className="rounded-xl border border-ink-200 bg-cream-50 p-4 text-sm text-ink-600">
        <strong>Distance ranking coming soon:</strong> once you set your home
        base and service radius in your profile, this feed will be sorted by
        distance and clipped to your radius.{" "}
        <Badge variant="moss" className="ml-1 align-middle">
          v0.2
        </Badge>
      </p>
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={
        active
          ? "inline-flex items-center gap-1.5 rounded-full border border-terracotta-600 bg-terracotta-50 px-3 py-1.5 text-sm text-terracotta-800"
          : "inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-cream-50 px-3 py-1.5 text-sm text-ink-700 hover:bg-cream-100"
      }
    >
      {children}
    </a>
  );
}

function tradeLabelFor(id: string): string {
  return TRADES.find((t) => t.id === id)?.label ?? id;
}
