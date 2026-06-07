import Link from "next/link";
import { ArrowRight, Plus, Lock } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getContractorProfile, getJobsForHomeowner } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/app/countdown";
import { tradeLabel } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const isContractor = user.role === "contractor";
  const firstName = (user.name ?? "").split(" ")[0] || "neighbor";

  const [profile, jobs] = await Promise.all([
    isContractor ? getContractorProfile(user.id) : Promise.resolve(null),
    getJobsForHomeowner(user.id),
  ]);

  const needsOnboarding = isContractor && !profile;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Hey {firstName}.
        </h1>
        <p className="mt-2 text-ink-600">
          {isContractor
            ? "Your work, your bids, your neighborhood."
            : "Post a job and let a few local pros bid on it, blind."}
        </p>
      </div>

      {/* Contractor onboarding gate */}
      {needsOnboarding && (
        <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-6">
          <h2 className="font-medium text-terracotta-900">Finish setting up your profile</h2>
          <p className="mt-1 text-sm text-terracotta-800/90">
            You can&apos;t see or bid on local jobs until neighbors can see who you are. Takes two
            minutes.
          </p>
          <Button asChild className="mt-4">
            <Link href="/onboarding">Set up profile</Link>
          </Button>
        </div>
      )}

      {/* Primary actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {isContractor ? (
          <>
            <NextStep
              href={needsOnboarding ? "/onboarding" : "/jobs"}
              title="Browse local jobs"
              body="Jobs inside your radius, filtered to your trades. Your bids stay blind."
            />
            <NextStep
              href="/profile"
              title="Your pro profile"
              body="Trades, service area, reviews, and your completion rate."
            />
          </>
        ) : (
          <>
            <NextStep
              href="/jobs/new"
              title="Post a job"
              body="Up to 5 local pros bid in 48 hours. You compare them side by side."
            />
            <NextStep
              href="/how-it-works"
              title="How blind bidding works"
              body="Bids stay hidden until the window closes, so the pricing stays honest."
            />
          </>
        )}
      </div>

      {/* Your jobs */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
            Your jobs
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/jobs/new">
              <Plus className="h-4 w-4" /> New job
            </Link>
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-cream-50 px-6 py-10 text-center">
            <p className="text-ink-600">You haven&apos;t posted a job yet.</p>
            <Button asChild className="mt-4">
              <Link href="/jobs/new">Post your first job</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => {
              const windowOpen =
                job.status === "open" && new Date(job.bidWindowClosesAt) > new Date();
              return (
                <li key={job.id}>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-cream-50 p-5 transition-colors hover:border-terracotta-300"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-ink-900">{job.title}</p>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-ink-500">
                        {tradeLabel(job.category)}
                        {job.neighborhood ? ` · ${job.neighborhood}` : ""} · posted{" "}
                        {relativeTime(job.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {windowOpen ? (
                        <span className="hidden items-center gap-1 text-sm text-terracotta-700 sm:flex">
                          <Lock className="h-3.5 w-3.5" />
                          <Countdown to={job.bidWindowClosesAt} />
                        </span>
                      ) : (
                        <Badge variant="secondary">
                          {job.status === "open" ? "Bidding closed" : job.status.replace("_", " ")}
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-terracotta-600" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function NextStep({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-ink-200 bg-cream-50 p-6 shadow-sm transition-colors hover:border-terracotta-300"
    >
      <h2 className="flex items-center justify-between font-medium text-ink-900">
        {title}
        <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-terracotta-600" />
      </h2>
      <p className="mt-2 text-sm text-ink-600">{body}</p>
    </Link>
  );
}
