import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { homeownerProfiles, tradespersonProfiles } from "@/lib/db/schema";
import { TRADES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const user = await requireUser();

  const [homeowner] =
    user.role === "homeowner"
      ? await db
          .select()
          .from(homeownerProfiles)
          .where(eq(homeownerProfiles.userId, user.id))
          .limit(1)
      : [undefined];

  const [tradesperson] =
    user.role === "tradesperson"
      ? await db
          .select()
          .from(tradespersonProfiles)
          .where(eq(tradespersonProfiles.userId, user.id))
          .limit(1)
      : [undefined];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Your profile
        </h1>
        <p className="mt-2 text-ink-600">
          The basics. Full editing comes in v0.2.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Row label="Name" value={user.name ?? "Not set"} />
          <Row label="Email" value={user.email} />
          <Row
            label="Role"
            value={
              <Badge variant={user.role === "tradesperson" ? "moss" : "default"}>
                {user.role}
              </Badge>
            }
          />
          {user.phone && <Row label="Phone" value={user.phone} />}
        </CardContent>
      </Card>

      {homeowner && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-serif text-xl font-semibold text-ink-900">
              Homeowner details
            </h2>
            <Row label="Neighborhood" value={homeowner.neighborhood ?? "Not set"} />
            <Row label="Address" value={homeowner.addressLine ?? "Not set"} />
          </CardContent>
        </Card>
      )}

      {tradesperson && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-serif text-xl font-semibold text-ink-900">
              Tradesperson details
            </h2>
            <Row label="Business" value={tradesperson.businessName ?? "Not set"} />
            <Row
              label="Trades"
              value={
                tradesperson.trades.length > 0
                  ? tradesperson.trades
                      .map(
                        (t) =>
                          TRADES.find((x) => x.id === t)?.label ?? t
                      )
                      .join(", ")
                  : "Add yours during onboarding"
              }
            />
            <Row
              label="Verified"
              value={
                tradesperson.verified ? (
                  <Badge variant="moss">Verified pro</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )
              }
            />
          </CardContent>
        </Card>
      )}

      <p className="rounded-xl border border-ink-200 bg-cream-50 p-4 text-sm text-ink-600">
        <strong>Coming in v0.2:</strong> edit your profile, set your home base on a
        map, configure your service radius, upload portfolio photos, and run the
        verification flow.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm font-medium text-ink-500">{label}</dt>
      <dd className="text-right text-sm text-ink-900">{value}</dd>
    </div>
  );
}
