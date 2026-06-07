import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Clock, CheckCircle2 } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/app/avatar";
import { Stars } from "@/components/app/stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPublicContractor,
  getReviewsForUser,
  getCompletedJobsForContractor,
} from "@/lib/data";
import { latLngToNeighborhood, tradeLabel } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getPublicContractor(id);
  if (!c) return { title: "Pro not found" };
  const who = c.profile.businessName || c.user.name || "A Stoop pro";
  return { title: `${who} on Stoop`, description: c.profile.bio ?? undefined };
}

function reviewAvg(r: {
  quality: number;
  punctuality: number;
  cleanliness: number;
  communication: number;
}) {
  return (r.quality + r.punctuality + r.cleanliness + r.communication) / 4;
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPublicContractor(id);
  if (!data) notFound();

  const { user, profile } = data;
  const [reviews, pastJobs] = await Promise.all([
    getReviewsForUser(id),
    getCompletedJobsForContractor(id),
  ]);

  const neighborhood = latLngToNeighborhood(profile.lat, profile.lng);
  const rating = profile.ratingAvg ? Number(profile.ratingAvg) : null;
  const responseMins = profile.avgResponseTimeMins;
  const completion = profile.completionRate ? Number(profile.completionRate) : null;
  const displayName = profile.businessName || user.name || "A Stoop pro";

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b border-cream-200 bg-cream-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" aria-label="Stoop home">
            <Logo />
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/sign-up">Join Stoop</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-6 py-10">
        {/* Hero */}
        <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar src={user.photoUrl} name={displayName} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
                {displayName}
              </h1>
              {profile.licenseUrl && (
                <Badge variant="moss" className="gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" /> License on file
                </Badge>
              )}
            </div>
            {profile.businessName && user.name && (
              <p className="mt-0.5 text-ink-600">{user.name}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
              {neighborhood && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-ink-400" />
                  {neighborhood} · {profile.serviceRadiusKm} km radius
                </span>
              )}
              <span>On Stoop since {relativeTime(user.createdAt)}</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Rating"
            value={
              rating ? (
                <span className="flex items-center gap-1.5">
                  {rating.toFixed(1)}
                  <Stars value={rating} size={14} />
                </span>
              ) : (
                "New"
              )
            }
          />
          <Stat label="Jobs done" value={String(profile.jobsCompleted)} />
          <Stat
            label="Completion"
            value={completion != null ? `${Math.round(completion)}%` : "—"}
          />
          <Stat
            label="Responds"
            value={responseMins != null ? formatMins(responseMins) : "—"}
          />
        </section>

        {/* Trades */}
        {profile.tradeCategories.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
              Trades
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.tradeCategories.map((t) => (
                <Badge key={t} variant="secondary">
                  {tradeLabel(t)}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Bio */}
        {profile.bio && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
              About
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-ink-700">{profile.bio}</p>
          </section>
        )}

        {/* Reviews */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
            Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink-200 bg-cream-50 px-4 py-6 text-center text-sm text-ink-500">
              No reviews yet. Be the first neighbor to hire {user.name?.split(" ")[0] ?? "them"}.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-ink-200 bg-cream-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={r.reviewerPhotoUrl} name={r.reviewerName} size="sm" />
                      <span className="text-sm font-medium text-ink-900">
                        {r.reviewerName ?? "A neighbor"}
                      </span>
                    </div>
                    <Stars value={reviewAvg(r)} size={14} />
                  </div>
                  {r.comment && <p className="mt-3 text-sm text-ink-700">{r.comment}</p>}
                  <p className="mt-2 text-xs text-ink-400">{relativeTime(r.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past work */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
            Past work
          </h2>
          {pastJobs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink-200 bg-cream-50 px-4 py-6 text-center text-sm text-ink-500">
              Completed jobs will show up here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pastJobs.map((j) => (
                <div key={j.id} className="overflow-hidden rounded-xl border border-ink-200 bg-cream-50">
                  {j.photoUrls[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={j.photoUrls[0]} alt={j.title} className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-cream-100 text-ink-300">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-ink-900">{j.title}</p>
                    <p className="text-xs text-ink-500">{tradeLabel(j.category)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-cream-50 px-4 py-3 text-center">
      <div className="text-lg font-semibold text-ink-900">{value}</div>
      <div className="mt-0.5 text-xs text-ink-500">{label}</div>
    </div>
  );
}

function formatMins(mins: number): string {
  if (mins < 60) return `${mins}m`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)}h`;
  return `${Math.round(mins / (60 * 24))}d`;
}
