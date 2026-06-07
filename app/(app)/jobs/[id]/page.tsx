import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Clock, Lock, MapPin } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getJobById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/components/app/countdown";
import { tradeLabel } from "@/lib/constants";
import { formatCurrency, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Job" };

function budgetLabel(min: string | null, max: string | null): string {
  const lo = min ? Number(min) : null;
  const hi = max ? Number(max) : null;
  if (lo != null && hi != null) return `${formatCurrency(lo)} to ${formatCurrency(hi)}`;
  if (lo != null) return `From ${formatCurrency(lo)}`;
  if (hi != null) return `Up to ${formatCurrency(hi)}`;
  return "Open to bids";
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const job = await getJobById(id);

  if (!job) notFound();
  // For now this is the homeowner's own view. The contractor bidding view is phase 4.
  if (job.homeownerId !== user.id) redirect("/dashboard");

  const windowOpen = job.status === "open" && new Date(job.bidWindowClosesAt) > new Date();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{tradeLabel(job.category)}</Badge>
          <JobStatusBadge status={job.status} windowOpen={windowOpen} />
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          {job.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
          {job.neighborhood && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {job.neighborhood}
            </span>
          )}
          <span>Posted {relativeTime(job.createdAt)}</span>
        </div>
      </header>

      {/* Status banner */}
      {windowOpen ? (
        <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-5">
          <div className="flex items-center gap-2 font-medium text-terracotta-900">
            <Lock className="h-4 w-4" /> Bidding is open and blind
          </div>
          <p className="mt-1.5 text-sm text-terracotta-800/90">
            Local pros are placing bids you can&apos;t see yet. When the window closes you&apos;ll
            see every bid at once, side by side, so the pricing stays honest.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-cream-50 px-3 py-1 text-sm font-medium text-ink-800">
            <Clock className="h-4 w-4 text-terracotta-600" />
            Closes in <Countdown to={job.bidWindowClosesAt} />
          </div>
        </div>
      ) : job.status === "open" || job.status === "bidding_closed" ? (
        <div className="rounded-2xl border border-ink-200 bg-cream-50 p-5">
          <div className="font-medium text-ink-900">Bidding has closed.</div>
          <p className="mt-1.5 text-sm text-ink-600">
            Your bids are in. The side-by-side comparison and accept-and-pay flow land in the
            next build, then you&apos;ll pick your pro right here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-200 bg-cream-50 p-5">
          <div className="font-medium text-ink-900">This job is {job.status.replace("_", " ")}.</div>
        </div>
      )}

      {/* Photos */}
      {job.photoUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {job.photoUrls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`${job.title} photo ${i + 1}`}
              className="aspect-square w-full rounded-xl border border-ink-200 object-cover"
            />
          ))}
        </div>
      )}

      {/* Details */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">
          Details
        </h2>
        <p className="whitespace-pre-line leading-relaxed text-ink-700">{job.description}</p>
      </section>

      <section className="flex items-center justify-between rounded-xl border border-ink-200 bg-cream-50 px-5 py-4">
        <span className="text-sm text-ink-500">Budget</span>
        <span className="font-medium text-ink-900">{budgetLabel(job.budgetMin, job.budgetMax)}</span>
      </section>
    </div>
  );
}

function JobStatusBadge({ status, windowOpen }: { status: string; windowOpen: boolean }) {
  if (windowOpen) return <Badge>Bidding open</Badge>;
  const map: Record<string, string> = {
    open: "Bidding closed",
    bidding_closed: "Bidding closed",
    hired: "Hired",
    in_progress: "In progress",
    completed: "Completed",
    reviewed: "Reviewed",
    cancelled: "Cancelled",
  };
  return <Badge variant="secondary">{map[status] ?? status}</Badge>;
}
