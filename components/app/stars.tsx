"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Star rating. Read-only when `onChange` is omitted; interactive (1-5) when
 * provided (used by the review form in phase 7).
 */
export function Stars({
  value,
  onChange,
  size = 16,
  className,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  className?: string;
}) {
  const interactive = typeof onChange === "function";
  const rounded = Math.round(value);

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rounded;
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              filled ? "fill-terracotta-500 text-terracotta-500" : "fill-none text-ink-300"
            )}
          />
        );
        return interactive ? (
          <button
            key={i}
            type="button"
            onClick={() => onChange!(i)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
          >
            {star}
          </button>
        ) : (
          <span key={i}>{star}</span>
        );
      })}
    </div>
  );
}
