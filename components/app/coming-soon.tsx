import Link from "next/link";
import { Hammer } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Placeholder shown for app surfaces that are being rebuilt phase by phase on
 * the new blind-bidding model. Keeps the deploy green and honest while the
 * real screens land.
 */
export function ComingSoon({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-ink-200 bg-cream-50 px-8 py-16 text-center shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-700">
        <Hammer className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-semibold tracking-tight text-ink-900">
        {title}
      </h1>
      <p className="mt-2 text-ink-600">{description}</p>
      {cta ? (
        <Button asChild className="mt-6">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
