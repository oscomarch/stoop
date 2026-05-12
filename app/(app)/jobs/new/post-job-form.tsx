"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TRADES, BROOKLYN_NEIGHBORHOODS, type TradeId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { postJob, type PostJobState } from "../actions";

type Urgency = "flexible" | "this_week" | "asap";

const URGENCIES: { id: Urgency; label: string; hint: string }[] = [
  { id: "flexible", label: "Flexible", hint: "Next couple of weeks is fine" },
  { id: "this_week", label: "This week", hint: "Within 7 days, ideally" },
  { id: "asap", label: "ASAP", hint: "Today or tomorrow" },
];

export function PostJobForm({ initialTrade }: { initialTrade: TradeId }) {
  const [trade, setTrade] = React.useState<TradeId>(initialTrade);
  const [urgency, setUrgency] = React.useState<Urgency>("flexible");
  const [state, formAction, pending] = useActionState<
    PostJobState | undefined,
    FormData
  >(postJob, undefined);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-ink-200 bg-cream-50 p-6 shadow-sm"
    >
      <input type="hidden" name="trade" value={trade} />
      <input type="hidden" name="urgency" value={urgency} />

      <div>
        <Label>Trade</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {TRADES.map((t) => {
            const active = t.id === trade;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTrade(t.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm transition-colors",
                  active
                    ? "border-terracotta-600 bg-terracotta-50 text-terracotta-800"
                    : "border-ink-200 bg-cream-50 text-ink-700 hover:bg-cream-100"
                )}
                aria-pressed={active}
              >
                <span className="text-xl" aria-hidden>
                  {t.emoji}
                </span>
                {t.label}
              </button>
            );
          })}
        </div>
        {state?.fieldErrors?.trade && (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.trade}</p>
        )}
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Leaky bathroom faucet"
          className="mt-1.5"
        />
        {state?.fieldErrors?.title && (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.title}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="What's broken, what you'd like done, any constraints (e.g. pre-war building, weekends only)."
          className="mt-1.5"
        />
        <p className="mt-1 text-xs text-ink-500">
          The more context, the better the bids.
        </p>
        {state?.fieldErrors?.description && (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="budgetLow">Budget (low)</Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">$</span>
            <Input
              id="budgetLow"
              name="budgetLow"
              type="number"
              inputMode="decimal"
              min={0}
              step={10}
              placeholder="100"
              className="pl-7"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="budgetHigh">Budget (high)</Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">$</span>
            <Input
              id="budgetHigh"
              name="budgetHigh"
              type="number"
              inputMode="decimal"
              min={0}
              step={10}
              placeholder="300"
              className="pl-7"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Urgency</Label>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {URGENCIES.map((u) => {
            const active = u.id === urgency;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setUrgency(u.id)}
                className={cn(
                  "rounded-xl border p-3 text-left text-sm transition-colors",
                  active
                    ? "border-terracotta-600 bg-terracotta-50"
                    : "border-ink-200 bg-cream-50 hover:bg-cream-100"
                )}
                aria-pressed={active}
              >
                <p className="font-medium text-ink-900">{u.label}</p>
                <p className="text-xs text-ink-500">{u.hint}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="neighborhood">Neighborhood</Label>
        <select
          id="neighborhood"
          name="neighborhood"
          defaultValue=""
          className="mt-1.5 flex h-11 w-full rounded-lg border border-ink-200 bg-cream-50 px-4 py-2 text-base text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
        >
          <option value="">Pick yours</option>
          {BROOKLYN_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Posting your job…
          </>
        ) : (
          "Post job"
        )}
      </Button>
      <p className="text-center text-xs text-ink-500">
        Free to post. You only pay when you accept a bid and the work is done.
      </p>
    </form>
  );
}
