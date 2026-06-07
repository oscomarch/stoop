"use client";

import * as React from "react";
import { Camera, Check, FileText, Loader2, Upload } from "lucide-react";

import { Avatar } from "@/components/app/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TRADES, BROOKLYN_NEIGHBORHOODS } from "@/lib/constants";
import { uploadPublicFile, uploadPrivateFile, validateImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { saveContractorProfile } from "@/app/(app)/onboarding/actions";

export type ContractorFormInitial = {
  businessName?: string | null;
  bio?: string | null;
  tradeCategories?: string[];
  serviceRadiusKm?: number;
  neighborhood?: string | null;
  photoUrl?: string | null;
  hasLicense?: boolean;
};

export function ContractorProfileForm({
  userId,
  defaultName,
  initial,
  redirectTo,
  submitLabel = "Save profile",
}: {
  userId: string;
  defaultName: string;
  initial?: ContractorFormInitial | null;
  redirectTo?: string;
  submitLabel?: string;
}) {
  const [name, setName] = React.useState(defaultName ?? "");
  const [businessName, setBusinessName] = React.useState(initial?.businessName ?? "");
  const [bio, setBio] = React.useState(initial?.bio ?? "");
  const [trades, setTrades] = React.useState<string[]>(initial?.tradeCategories ?? []);
  const [neighborhood, setNeighborhood] = React.useState(initial?.neighborhood ?? "");
  const [radius, setRadius] = React.useState(initial?.serviceRadiusKm ?? 8);

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(
    initial?.photoUrl ?? null
  );
  const [licenseFile, setLicenseFile] = React.useState<File | null>(null);
  const [hasLicense] = React.useState(initial?.hasLicense ?? false);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function toggleTrade(id: string) {
    setTrades((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file);
    if (err) return setError(err);
    setError(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Tell us your name.");
    if (trades.length === 0) return setError("Pick at least one trade.");
    if (!neighborhood) return setError("Pick your home base neighborhood.");

    setSubmitting(true);
    try {
      let photoUrl = initial?.photoUrl ?? "";
      if (photoFile) photoUrl = await uploadPublicFile("avatars", userId, photoFile);

      let licenseUrl = "";
      if (licenseFile) licenseUrl = await uploadPrivateFile(userId, licenseFile);

      const res = await saveContractorProfile({
        name: name.trim(),
        businessName: businessName.trim(),
        bio: bio.trim(),
        neighborhood,
        serviceRadiusKm: radius,
        tradeCategories: trades,
        photoUrl,
        licenseUrl,
        redirectTo,
      });
      if (res?.error) {
        setError(res.error);
        setSubmitting(false);
      }
      // success: the action redirects.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const miles = Math.round(radius * 0.621);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Photo + name */}
      <section className="flex items-center gap-5">
        <div className="relative">
          <Avatar src={photoPreview} name={name} size="xl" />
          <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-terracotta-600 text-cream-50 shadow-sm transition-colors hover:bg-terracotta-700">
            <Camera className="h-4 w-4" />
            <input type="file" accept="image/*" className="sr-only" onChange={onPhotoChange} />
          </label>
        </div>
        <div className="flex-1">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marco Rossi"
            className="mt-1.5"
            required
          />
        </div>
      </section>

      <Field label="Business name" hint="Optional. Leave blank to use your name.">
        <Input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Rossi Plumbing"
        />
      </Field>

      {/* Trades */}
      <div>
        <Label>What do you do?</Label>
        <p className="mb-3 mt-1 text-sm text-ink-500">Pick every trade you take on.</p>
        <div className="flex flex-wrap gap-2">
          {TRADES.map((t) => {
            const active = trades.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTrade(t.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-terracotta-300 bg-terracotta-100 text-terracotta-800"
                    : "border-ink-200 bg-cream-50 text-ink-700 hover:border-ink-300"
                )}
              >
                <span aria-hidden>{t.emoji}</span>
                {t.label}
                {active && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location + radius */}
      <Field label="Home base" hint="Where you work out of. We only show neighbors your area, never your address.">
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-ink-200 bg-cream-50 px-4 py-2 text-base text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
        >
          <option value="">Pick your neighborhood</option>
          {BROOKLYN_NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="radius">How far will you travel?</Label>
          <span className="text-sm font-medium text-ink-700">
            {radius} km <span className="text-ink-400">(~{miles} mi)</span>
          </span>
        </div>
        <input
          id="radius"
          type="range"
          min={1}
          max={40}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="mt-3 w-full accent-terracotta-600"
        />
      </div>

      {/* Bio */}
      <Field label="Short bio" hint="Optional. A line or two on who you are and what you're great at.">
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Third-generation plumber. Grew up in Carroll Gardens. No job too small."
          maxLength={600}
        />
      </Field>

      {/* License */}
      <div>
        <Label>License or certification</Label>
        <p className="mb-3 mt-1 text-sm text-ink-500">
          Upload one doc. Neighbors see a verified badge, never the file itself.
        </p>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink-300 bg-cream-50 px-4 py-3 text-sm text-ink-700 transition-colors hover:border-terracotta-300">
          {licenseFile ? (
            <>
              <FileText className="h-5 w-5 text-terracotta-600" />
              <span className="truncate">{licenseFile.name}</span>
            </>
          ) : hasLicense ? (
            <>
              <Check className="h-5 w-5 text-moss-600" />
              <span>License on file. Upload a new one to replace it.</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-ink-400" />
              <span>Upload license (PDF or image)</span>
            </>
          )}
          <input
            type="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={(e) => setLicenseFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {hint && <p className="mb-2 mt-1 text-sm text-ink-500">{hint}</p>}
      <div className={hint ? "" : "mt-1.5"}>{children}</div>
    </div>
  );
}
