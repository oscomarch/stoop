import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";

/**
 * Resolve the currently authenticated Stoop user. Combines Supabase Auth
 * (for identity) with our application `users` row (for role and metadata).
 *
 * Throws a redirect to /sign-in if there's no session.
 */
export async function requireUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  if (!row) {
    // Auth session exists but no application row, likely a stale auth row.
    // Send them to a flow that re-creates the profile.
    redirect("/sign-in?error=profile_missing");
  }

  return row;
}

/**
 * Like `requireUser` but only allows a specific role.
 */
export async function requireRole(
  role: "homeowner" | "tradesperson"
): Promise<User> {
  const u = await requireUser();
  if (u.role !== role) {
    redirect("/dashboard?error=wrong_role");
  }
  return u;
}

/**
 * Resolve the current user without redirecting. Returns null if not signed in.
 */
export async function getOptionalUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  return row ?? null;
}
