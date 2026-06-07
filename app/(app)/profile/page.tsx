import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getContractorProfile } from "@/lib/data";
import { latLngToNeighborhood } from "@/lib/constants";
import { ContractorProfileForm } from "@/components/app/contractor-profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser();

  if (user.role === "contractor") {
    const profile = await getContractorProfile(user.id);
    if (!profile) redirect("/onboarding");

    return (
      <div className="mx-auto max-w-xl space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
              Your pro profile
            </h1>
            <p className="mt-2 text-ink-600">Keep it sharp. Neighbors read this before they hire.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={`/pros/${user.id}`}>
              View public
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </header>

        <ContractorProfileForm
          userId={user.id}
          defaultName={user.name ?? ""}
          redirectTo="/profile"
          submitLabel="Save changes"
          initial={{
            businessName: profile.businessName,
            bio: profile.bio,
            tradeCategories: profile.tradeCategories,
            serviceRadiusKm: profile.serviceRadiusKm,
            neighborhood: latLngToNeighborhood(profile.lat, profile.lng),
            photoUrl: user.photoUrl,
            hasLicense: !!profile.licenseUrl,
          }}
        />
      </div>
    );
  }

  // Homeowner account view
  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Your account
        </h1>
        <p className="mt-2 text-ink-600">The basics. More controls land as we build.</p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Row label="Name" value={user.name ?? "Not set"} />
          <Row label="Email" value={user.email ?? "Not set"} />
          <Row label="Neighborhood" value="Set per job" />
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-ink-200 bg-cream-50 p-6">
        <h2 className="font-medium text-ink-900">Need something done?</h2>
        <p className="mt-1 text-sm text-ink-600">
          Post a job and a few local pros bid on it within 48 hours.
        </p>
        <Button asChild className="mt-4">
          <Link href="/jobs/new">Post a job</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-cream-200 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium text-ink-900">{value}</span>
    </div>
  );
}
