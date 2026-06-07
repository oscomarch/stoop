"use client";

import * as React from "react";
import { Loader2, ImagePlus, X, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TRADES, BROOKLYN_NEIGHBORHOODS } from "@/lib/constants";
import { uploadPublicFile, validateImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { createJob } from "./actions";

type Photo = { file: File; preview: string };

export function PostJobForm({ userId }: { userId: string }) {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [neighborhood, setNeighborhood] = React.useState("");
  const [budgetMin, setBudgetMin] = React.useState("");
  const [budgetMax, setBudgetMax] = React.useState("");
  const [photos, setPhotos] = React.useState<Photo[]>([]);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function onPhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    for (const f of files) {
      const err = validateImage(f);
      if (err) return setError(err);
    }
    setError(null);
    setPhotos((prev) =>
      [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))].slice(0, 8)
    );
  }

  function removePhoto(i: number) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 4) return setError("Give your job a clear title.");
    if (!category) return setError("Pick a category.");
    if (description.trim().length < 10) return setError("Add a few details so pros can bid well.");
    if (!neighborhood) return setError("Pick your neighborhood.");

    const min = budgetMin ? Number(budgetMin) : null;
    const max = budgetMax ? Number(budgetMax) : null;
    if (min != null && max != null && max < min) return setError("Max budget must be at least the min.");

    setSubmitting(true);
    try {
      const photoUrls: string[] = [];
      for (const p of photos) {
        photoUrls.push(await uploadPublicFile("job-photos", userId, p.file));
      }

      const res = await createJob({
        title: title.trim(),
        category,
        description: description.trim(),
        neighborhood,
        budgetMin: min,
        budgetMax: max,
        photoUrls,
      });
      if (res?.error) {
        setError(res.error);
        setSubmitting(false);
      }
      // success: action redirects to the job page.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <Label htmlFor="title">What needs doing?</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Leaky kitchen faucet"
          className="mt-1.5"
          required
        />
      </div>

      <div>
        <Label>Category</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRADES.map((t) => {
            const active = category === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setCategory(t.id)}
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
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Details</Label>
        <p className="mb-2 mt-1 text-sm text-ink-500">
          The more pros know, the sharper their bids. What, where in the home, how urgent.
        </p>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="The cold tap in my kitchen drips constantly and the handle is loose. Second floor of a brownstone. Hoping to get it sorted this week."
          maxLength={2000}
        />
      </div>

      {/* Photos */}
      <div>
        <Label>Photos</Label>
        <p className="mb-2 mt-1 text-sm text-ink-500">
          Optional, but jobs with photos get better bids.
        </p>
        <div className="flex flex-wrap gap-3">
          {photos.map((p, i) => (
            <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-ink-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.preview} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/70 text-cream-50"
                aria-label="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {photos.length < 8 && (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink-300 bg-cream-50 text-ink-400 transition-colors hover:border-terracotta-300 hover:text-terracotta-600">
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={onPhotosChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="neighborhood">Where is it?</Label>
        <p className="mb-2 mt-1 text-sm text-ink-500">
          Pros only ever see your neighborhood. Your exact address stays hidden until you hire.
        </p>
        <select
          id="neighborhood"
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
        {/* Mapbox precise pin + geolocation drops in here later. */}
        {neighborhood && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-200 bg-cream-100 px-4 py-3 text-sm text-ink-600">
            <MapPin className="h-4 w-4 text-terracotta-600" />
            Pinned to {neighborhood}. You&apos;ll set the exact spot on a map once you hire.
          </div>
        )}
      </div>

      {/* Budget */}
      <div>
        <Label>Budget range</Label>
        <p className="mb-2 mt-1 text-sm text-ink-500">Optional. A range helps pros bid realistically.</p>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">$</span>
            <Input
              type="number"
              min={0}
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="Min"
              className="pl-7"
            />
          </div>
          <span className="text-ink-400">to</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">$</span>
            <Input
              type="number"
              min={0}
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="Max"
              className="pl-7"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Posting…
          </>
        ) : (
          "Post job · start the 48-hour window"
        )}
      </Button>
    </form>
  );
}
