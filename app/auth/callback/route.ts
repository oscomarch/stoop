import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, homeownerProfiles, tradespersonProfiles } from "@/lib/db/schema";

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
  const next = url.searchParams.get("next") ?? "/dashboard";

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

  // Backfill the application user/profile rows if signUp() couldn't write them
  // (e.g., the DB was down during signup). Idempotent.
  const meta = data.user.user_metadata as { name?: string; role?: string } | null;
  const role = meta?.role === "tradesperson" ? "tradesperson" : "homeowner";

  try {
    await db
      .insert(users)
      .values({
        id: data.user.id,
        email: data.user.email ?? "",
        name: meta?.name ?? null,
        role,
      })
      .onConflictDoNothing({ target: users.id });

    if (role === "homeowner") {
      await db
        .insert(homeownerProfiles)
        .values({ userId: data.user.id })
        .onConflictDoNothing({ target: homeownerProfiles.userId });
    } else {
      await db
        .insert(tradespersonProfiles)
        .values({ userId: data.user.id })
        .onConflictDoNothing({ target: tradespersonProfiles.userId });
    }
  } catch (err) {
    console.error("[auth/callback] backfill failed:", err);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
