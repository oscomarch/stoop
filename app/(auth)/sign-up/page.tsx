import type { Metadata } from "next";
import Link from "next/link";

import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Stoop account.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = role === "tradesperson" ? "tradesperson" : "homeowner";

  return (
    <>
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Join Stoop.
        </h1>
        <p className="mt-2 text-ink-600">
          Pick who you are. We&apos;ll set up the right experience.
        </p>
      </div>
      <SignUpForm initialRole={initialRole} />
      <p className="text-center text-sm text-ink-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-terracotta-700 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
