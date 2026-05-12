import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Check your email",
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="rounded-2xl border border-ink-200 bg-cream-50 p-8 text-center shadow-sm">
      <Mail className="mx-auto h-10 w-10 text-terracotta-600" />
      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-ink-900">
        Check your inbox.
      </h1>
      <p className="mt-2 text-ink-600">
        We just sent a confirmation link to{" "}
        <strong className="text-ink-900">{email ?? "your email"}</strong>.
      </p>
      <p className="mt-1 text-sm text-ink-500">
        Click it to activate your account. The link expires in 24 hours.
      </p>
    </div>
  );
}
