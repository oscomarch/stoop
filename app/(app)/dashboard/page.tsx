import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, Hammer, Inbox } from "lucide-react";
import { desc, eq } from "drizzle-orm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobs, bids } from "@/lib/db/schema";
import { TRADES } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireUser();

  if (user.role === "homeowner") {
    return <HomeownerDashboard userId={user.id} userName={user.name} />;
  }
  return <TradespersonDashboard userId={user.id} userName={user.name} />;
}

async function HomeownerDashboard({
  userId,
  userName,
}: {
  userId: string;
  userName: string | null;
}) {
  const recentJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.homeownerId, userId))
    .orderBy(desc(jobs.createdAt))
    .limit(5);

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
            Hey{userName ? `, ${userName.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-1 text-ink-600">
            Got something around the house? Get bids from your block.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/jobs/new">
            Post a job
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <section>
        <h2 className="font-serif text-xl font-semibold text-ink-900">Quick start</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TRADES.map((t) => (
            <li key={t.id}>
              <Link
                href={`/jobs/new?trade=${t.id}`}
                className="flex h-full flex-col rounded-xl border border-ink-200 bg-cream-50 p-4 transition-all hover:border-terracotta-300 hover:shadow-sm"
              >
                <span className="text-2xl" aria-hidden>
                  {t.emoji}
                </span>
                <p className="mt-3 font-medium text-ink-900">{t.label}</p>
                <p className="mt-0.5 text-xs text-ink-500">Post a {t.label.toLowerCase()} job</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold text-ink-900">Your recent jobs</h2>
        {recentJobs.length === 0 ? (
          <EmptyJobs />
        ) : (
          <ul className="mt-4 space-y-3">
            {recentJobs.map((job) => (
              <li key={job.id}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {tradeLabel(job.trade)} ·{" "}
                          {job.neighborhood ?? "Brooklyn"} ·{" "}
                          {relativeTime(job.createdAt)}
                        </CardDescription>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

async function TradespersonDashboard({
  userId,
  userName,
}: {
  userId: string;
  userName: string | null;
}) {
  const recentBids = await db
    .select()
    .from(bids)
    .where(eq(bids.tradespersonId, userId))
    .orderBy(desc(bids.createdAt))
    .limit(5);

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
            Hey{userName ? `, ${userName.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-1 text-ink-600">
            New jobs come in every day. Bid early to stand out.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/jobs">
            Browse jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <section className="grid gap-6 sm:grid-cols-3">
        <StatCard icon={Inbox} label="Active bids" value={recentBids.filter((b) => b.status === "pending").length} />
        <StatCard icon={Hammer} label="Jobs won" value={recentBids.filter((b) => b.status === "accepted").length} />
        <StatCard icon={ClipboardList} label="Total submitted" value={recentBids.length} />
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold text-ink-900">Recent bids</h2>
        {recentBids.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <Inbox className="h-8 w-8 text-ink-400" />
              <p className="text-ink-700">No bids yet — head to the jobs board.</p>
              <Button asChild size="sm">
                <Link href="/jobs">Browse jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="mt-4 space-y-3">
            {recentBids.map((bid) => (
              <li key={bid.id}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle>Bid · ${bid.price}</CardTitle>
                        <CardDescription className="mt-1">
                          {relativeTime(bid.createdAt)}
                          {bid.message ? ` · ${bid.message.slice(0, 80)}` : ""}
                        </CardDescription>
                      </div>
                      <StatusBadge status={bid.status} />
                    </div>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyJobs() {
  return (
    <Card className="mt-4">
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <ClipboardList className="h-8 w-8 text-ink-400" />
        <p className="text-ink-700">No jobs yet. Let&apos;s fix that.</p>
        <Button asChild size="sm">
          <Link href="/jobs/new">Post your first job</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-xl bg-terracotta-100 p-3 text-terracotta-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-ink-500">{label}</p>
          <p className="font-serif text-2xl font-semibold text-ink-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "open" || status === "pending"
      ? "default"
      : status === "accepted" || status === "completed" || status === "awarded"
      ? "moss"
      : "secondary";
  return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
}

function tradeLabel(id: string): string {
  return TRADES.find((t) => t.id === id)?.label ?? id;
}
