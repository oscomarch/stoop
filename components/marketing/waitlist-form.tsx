"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BROOKLYN_NEIGHBORHOODS, TRADES, type TradeId } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Role = "homeowner" | "tradesperson";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; email: string }
  | { status: "error"; message: string };

export function WaitlistForm() {
  const [role, setRole] = React.useState<Role>("homeowner");
  const [state, setState] = React.useState<State>({ status: "idle" });
  const [selectedTrades, setSelectedTrades] = React.useState<TradeId[]>([]);

  async function onSubmit(formData: FormData) {
    setState({ status: "submitting" });

    const payload = {
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      role,
      neighborhood: String(formData.get("neighborhood") ?? "") || null,
      tradesInterested:
        role === "tradesperson"
          ? selectedTrades
          : (formData.getAll("trade") as TradeId[]),
      referralSource: String(formData.get("referral") ?? "") || null,
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      setState({ status: "success", email: payload.email });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Try again in a moment.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-moss-500/30 bg-moss-500/10 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-moss-600" />
        <h3 className="mt-4 font-serif text-2xl font-semibold text-ink-900">
          You&apos;re on the stoop.
        </h3>
        <p className="mt-2 text-ink-600">
          We&apos;ll email <strong>{state.email}</strong> when we&apos;re ready for{" "}
          {role === "homeowner" ? "homeowners" : "pros"} in your area.
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Want to bump the line? Tell a neighbor.
        </p>
      </div>
    );
  }

  return (
    <form
      action={onSubmit}
      className="rounded-2xl border border-ink-200 bg-cream-50 p-6 shadow-sm md:p-8"
    >
      <fieldset className="grid grid-cols-2 gap-2 rounded-xl bg-cream-100 p-1">
        <RolePill
          label="I need work done"
          active={role === "homeowner"}
          onClick={() => setRole("homeowner")}
        />
        <RolePill
          label="I work in the trades"
          active={role === "tradesperson"}
          onClick={() => setRole("tradesperson")}
        />
      </fieldset>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@brownstone.com"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <select
            id="neighborhood"
            name="neighborhood"
            required
            defaultValue=""
            className="mt-1.5 flex h-11 w-full rounded-lg border border-ink-200 bg-cream-50 px-4 py-2 text-base text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
          >
            <option value="" disabled>
              Pick yours
            </option>
            {BROOKLYN_NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {role === "tradesperson" && (
          <div>
            <Label>Trades you offer</Label>
            <p className="mt-1 text-xs text-ink-500">
              Pick all that apply. You can refine this when you sign up.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRADES.map((t) => {
                const active = selectedTrades.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTrades((prev) =>
                        active
                          ? prev.filter((x) => x !== t.id)
                          : [...prev, t.id]
                      );
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-terracotta-600 bg-terracotta-50 text-terracotta-800"
                        : "border-ink-200 bg-cream-50 text-ink-700 hover:bg-cream-100"
                    )}
                  >
                    <span aria-hidden>{t.emoji}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {role === "homeowner" && (
          <div>
            <Label>What kind of work do you usually need?</Label>
            <p className="mt-1 text-xs text-ink-500">Optional, helps us prioritize.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRADES.map((t) => (
                <label
                  key={t.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-cream-50 px-3 py-1.5 text-sm text-ink-700 hover:bg-cream-100 cursor-pointer has-[:checked]:border-terracotta-600 has-[:checked]:bg-terracotta-50 has-[:checked]:text-terracotta-800"
                >
                  <input
                    type="checkbox"
                    name="trade"
                    value={t.id}
                    className="sr-only"
                  />
                  <span aria-hidden>{t.emoji}</span>
                  {t.label}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="referral">How did you hear about us?</Label>
          <Input
            id="referral"
            name="referral"
            placeholder="A neighbor, Instagram, …"
            className="mt-1.5"
          />
        </div>
      </div>

      {state.status === "error" && (
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={state.status === "submitting"}
      >
        {state.status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding you…
          </>
        ) : role === "homeowner" ? (
          "Join the homeowner waitlist"
        ) : (
          "Apply to be a Stoop pro"
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-ink-500">
        By joining you agree to occasional emails about Stoop. No spam, ever.
      </p>
    </form>
  );
}

function RolePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-cream-50 text-ink-900 shadow-sm"
          : "text-ink-500 hover:text-ink-900"
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

/**
 * Wrapper section that pairs the form with a contextual headline.
 */
export function WaitlistSection() {
  return (
    <section id="waitlist" className="bg-cream-100 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-2">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-terracotta-700">
            Get on the list
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 text-balance md:text-5xl">
            Stoop opens block by block.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-600 text-pretty">
            Tell us where you live and we&apos;ll let you know the day it goes
            live near you. Brooklyn first. More soon.
          </p>
          <p className="mt-4 text-base text-ink-600">
            If you work in the trades, expect a short call from us to verify your
            license.
          </p>
        </div>
        <div className="lg:col-span-3">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
