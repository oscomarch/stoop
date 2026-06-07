import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await requireUser();
  const isContractor = user.role === "contractor";
  const firstName = (user.name ?? "").split(" ")[0] || "neighbor";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Hey {firstName}.
        </h1>
        <p className="mt-2 text-ink-600">
          {isContractor
            ? "Set up your profile so jobs near you start showing up."
            : "Post a job and let a few local pros bid on it, blind."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isContractor ? (
          <NextStep
            href="/profile"
            title="Finish your profile"
            body="Add your trades, service area, and license so neighbors can trust you."
          />
        ) : (
          <NextStep
            href="/jobs/new"
            title="Post a job"
            body="Tell us what needs doing. Up to 5 local pros bid in the next 48 hours."
          />
        )}
        <NextStep
          href={isContractor ? "/jobs" : "/dashboard"}
          title={isContractor ? "Browse local jobs" : "How bidding works"}
          body={
            isContractor
              ? "Jobs inside your radius, filtered to your trades. Bids stay blind."
              : "Bids are hidden until the window closes, then you compare them side by side."
          }
        />
      </div>
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
