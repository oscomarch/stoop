"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type SignInState } from "../actions";

export function SignInForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<SignInState | undefined, FormData>(
    signIn,
    undefined
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-ink-200 bg-cream-50 p-6 shadow-sm"
    >
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5"
        />
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
            Signing you in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
