import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TRADES } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";
import type { Job } from "@/lib/db/schema";

const URGENCY_LABEL: Record<Job["urgency"], string> = {
  flexible: "Flexible",
  this_week: "This week",
  asap: "ASAP",
};

export function JobCard({ job }: { job: Job }) {
  const trade = TRADES.find((t) => t.id === job.trade);

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <Card className="transition-all group-hover:border-terracotta-300 group-hover:shadow-md">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>
                {trade?.emoji ?? "🔨"}
              </span>
              <div>
                <p className="font-serif text-lg font-semibold leading-tight text-ink-900">
                  {job.title}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-terracotta-700">
                  {trade?.label ?? job.trade}
                </p>
              </div>
            </div>
            <Badge variant={job.urgency === "asap" ? "default" : "secondary"}>
              {URGENCY_LABEL[job.urgency]}
            </Badge>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-ink-700">
            {job.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.neighborhood ?? "Brooklyn"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {relativeTime(job.createdAt)}
            </span>
            {job.budgetLow && job.budgetHigh && (
              <span className="ml-auto font-medium text-ink-700">
                ${job.budgetLow} – ${job.budgetHigh}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
