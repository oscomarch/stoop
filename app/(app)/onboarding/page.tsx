import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getContractorProfile } from "@/lib/data";
import { ContractorProfileForm } from "@/components/app/contractor-profile-form";

export const metadata: Metadata = {
  title: "Set up your pro profile",
};

export default async function OnboardingPage() {
  const user = await requireUser();
  const existing = await getContractorProfile(user.id);

  // Already onboarded: send them to the editable profile instead.
  if (existing) redirect("/profile");

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-terracotta-700">Welcome to Stoop</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Set up your profile.
        </h1>
        <p className="mt-2 text-ink-600">
          Takes about two minutes. This is what neighbors see when they compare bids, so
          make it count.
        </p>
      </div>

      <ContractorProfileForm
        userId={user.id}
        defaultName={user.name ?? ""}
        redirectTo="/dashboard"
        submitLabel="Finish setup"
      />
    </div>
  );
}
