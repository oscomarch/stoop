import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { eq } from "drizzle-orm";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs, bids } from "@/lib/db/schema";
import { TRADES } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Job",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  if (!job) notFound();

  const jobBids =
    user.role === "homeowner" && job.homeownerId === user.id
      ? await db.select().from(bids).where(eq(bids.jobId, job.id))
      : [];

  const trade = TRADES.find((t) => t.id === job.trade);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href={user.role === "homeowner" ? "/dashboard" : "/jobs"}
        className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{trade?.label ?? job.trade}</Badge>
          <Badge variant="secondary">{job.status.replace("_", " ")}</Badge>
          <Badge variant="outline">
            {job.urgency === "asap"
              ? "ASAP"
              : job.urgency === "this_week"
              ? "This week"
              : "Flexible"}
          </Badge>
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink-900">
          {job.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.neighborhood ?? "Brooklyn"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Posted {relativeTime(job.createdAt)}
          </span>
          {job.budgetLow && job.budgetHigh && (
            <span className="font-medium text-ink-700">
              Budget: ${job.budgetLow} to ${job.budgetHigh}
            </span>
          )}
        </div>
      </header>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-serif text-lg font-semibold text-ink-900">Details</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-700">
            {job.description}
          </p>
        </CardContent>
      </Card>

      {user.role === "tradesperson" ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 p-6">
            <h2 className="font-serif text-lg font-semibold text-ink-900">
              Place a bid
            </h2>
            <p className="text-sm text-ink-600">
              Bidding goes live in v0.2 along with escrow payments. Save this job
              and we&apos;ll notify you the moment bids open.
            </p>
            <Badge variant="moss">v0.2</Badge>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold text-ink-900">
              Bids ({jobBids.length})
            </h2>
            {jobBids.length === 0 ? (
              <p className="mt-2 text-sm text-ink-600">
                No bids yet. Pros typically respond within a few hours during the
                workweek.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {jobBids.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-xl border border-ink-200 bg-cream-50 p-4"
                  >
                    <p className="font-medium text-ink-900">${b.price}</p>
                    {b.message && (
                      <p className="mt-1 text-sm text-ink-700">{b.message}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
