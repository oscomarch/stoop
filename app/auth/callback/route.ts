import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

/**
 * Email confirmation callback for Supabase Auth.
 *
 * Supabase sends users here after they click the link in their confirmation
 * email. We exchange the `code` for a session, then ensure the application-
 * level rows (`users`, profile) exist before sending the user into the app.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const explicitNext = url.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error?.message ?? "auth_failed")}`, request.url)
    );
  }

  // Backfill the application user row if signUp() couldn't write it
  // (e.g., the DB was down during signup). Idempotent. The contractor_profiles
  // row is created later during onboarding.
  const meta = data.user.user_metadata as { name?: string; role?: string } | null;
  const role =
    meta?.role === "contractor" || meta?.role === "tradesperson"
      ? "contractor"
      : "homeowner";

  try {
    await db
      .insert(users)
      .values({
        id: data.user.id,
        email: data.user.email ?? null,
        name: meta?.name ?? null,
        role,
        emailVerified: true,
      })
      .onConflictDoNothing({ target: users.id });
  } catch (err) {
    console.error("[auth/callback] backfill failed:", err);
  }

  // New contractors go straight to onboarding; the onboarding page bounces
  // them to /profile if they already have a profile. Everyone else lands on
  // their dashboard, unless a specific `next` was requested.
  const destination =
    explicitNext ?? (role === "contractor" ? "/onboarding" : "/dashboard");

  return NextResponse.redirect(new URL(destination, request.url));
}
