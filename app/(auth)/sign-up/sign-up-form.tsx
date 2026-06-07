"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BROOKLYN_NEIGHBORHOODS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { signUp, type SignUpState } from "../actions";

type Role = "homeowner" | "contractor";

export function SignUpForm({ initialRole }: { initialRole: Role }) {
  const [role, setRole] = React.useState<Role>(initialRole);
  const [state, formAction, pending] = useActionState<SignUpState | undefined, FormData>(
    signUp,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-ink-200 bg-cream-50 p-6 shadow-sm">
      <input type="hidden" name="role" value={role} />

      <fieldset className="grid grid-cols-2 gap-2 rounded-xl bg-cream-100 p-1">
        <RolePill
          label="Homeowner"
          active={role === "homeowner"}
          onClick={() => setRole("homeowner")}
        />
        <RolePill
          label="Pro"
          active={role === "contractor"}
          onClick={() => setRole("contractor")}
        />
      </fieldset>

      <Field
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        required
        error={state?.fieldErrors?.name}
      />
      <Field
        id="email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state?.fieldErrors?.email}
      />
      <Field
        id="password"
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        helper="At least 8 characters."
        error={state?.fieldErrors?.password}
      />

      {role === "homeowner" && (
        <div>
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <select
            id="neighborhood"
            name="neighborhood"
            defaultValue=""
            className="mt-1.5 flex h-11 w-full rounded-lg border border-ink-200 bg-cream-50 px-4 py-2 text-base text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
          >
            <option value="">Pick yours (optional)</option>
            {BROOKLYN_NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating your account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-xs text-ink-500">
        We&apos;ll send a confirmation email. Click the link to activate your account.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  helper,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  helper?: string;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className="mt-1.5" {...props} />
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs text-ink-500">{helper}</p>
      ) : null}
    </div>
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
