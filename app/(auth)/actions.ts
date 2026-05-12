"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, homeownerProfiles, tradespersonProfiles } from "@/lib/db/schema";
import { env } from "@/lib/env";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().min(1, "Tell us your name."),
  role: z.enum(["homeowner", "tradesperson"]),
  neighborhood: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignUpState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof signUpSchema>, string>>;
};

export type SignInState = {
  error?: string;
};

export async function signUp(
  _prev: SignUpState | undefined,
  formData: FormData
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
    neighborhood: formData.get("neighborhood") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: SignUpState["fieldErrors"] = {};
    for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (v && v[0]) fieldErrors[k as keyof typeof fieldErrors] = v[0];
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        name: parsed.data.name,
        role: parsed.data.role,
      },
    },
  });

  if (error || !data.user) {
    return {
      error:
        error?.message ?? "Something went wrong creating your account. Try again.",
    };
  }

  // Create the application-level user row. If email confirmations are ON in
  // Supabase, the row exists in `auth.users` but has no session yet — we still
  // want to be able to associate the role with the account when the user
  // confirms, so we write the application row eagerly.
  try {
    await db.insert(users).values({
      id: data.user.id,
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
    });

    if (parsed.data.role === "homeowner") {
      await db.insert(homeownerProfiles).values({
        userId: data.user.id,
        neighborhood: parsed.data.neighborhood ?? null,
      });
    } else {
      await db.insert(tradespersonProfiles).values({
        userId: data.user.id,
      });
    }
  } catch (err) {
    console.error("[signUp] DB write failed:", err);
    // Don't block the signup flow; we can backfill via the callback if needed.
  }

  // If the user has an active session (email confirmation disabled), redirect
  // into the app. Otherwise show the "check your email" state.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  redirect(`/sign-up/check-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function signIn(
  _prev: SignInState | undefined,
  formData: FormData
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const next = String(formData.get("next") ?? "/dashboard");
  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
