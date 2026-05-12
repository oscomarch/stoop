import type { Metadata } from "next";
import Link from "next/link";

import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Stoop account.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Welcome back.
        </h1>
        <p className="mt-2 text-ink-600">
          Sign in to manage your jobs and bids.
        </p>
      </div>
      <SignInForm next={next} />
      <p className="text-center text-sm text-ink-600">
        New to Stoop?{" "}
        <Link href="/sign-up" className="font-medium text-terracotta-700 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
