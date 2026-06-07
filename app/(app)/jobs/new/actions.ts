"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { jobs, type TradeCategoryValue } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { TRADES, BROOKLYN_NEIGHBORHOODS, neighborhoodToLatLng } from "@/lib/constants";

const TRADE_IDS = TRADES.map((t) => t.id) as [string, ...string[]];
const NEIGHBORHOODS = BROOKLYN_NEIGHBORHOODS as readonly string[];

const BID_WINDOW_HOURS = 48;

const schema = z
  .object({
    title: z.string().trim().min(4, "Give it a clear title.").max(120),
    category: z.enum(TRADE_IDS, { message: "Pick a category." }),
    description: z.string().trim().min(10, "Add a few details so pros can bid well.").max(2000),
    neighborhood: z
      .string()
      .refine((n) => NEIGHBORHOODS.includes(n), "Pick your neighborhood."),
    budgetMin: z.number().int().positive().max(1_000_000).nullable().optional(),
    budgetMax: z.number().int().positive().max(1_000_000).nullable().optional(),
    photoUrls: z.array(z.string().url()).max(8).default([]),
  })
  .refine(
    (d) => d.budgetMin == null || d.budgetMax == null || d.budgetMax >= d.budgetMin,
    { message: "Max budget must be at least the min.", path: ["budgetMax"] }
  );

export type CreateJobInput = z.input<typeof schema>;
export type CreateJobState = { error?: string };

export async function createJob(
  input: CreateJobInput
): Promise<CreateJobState | void> {
  const user = await requireUser();

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;
  const { lat, lng } = neighborhoodToLatLng(d.neighborhood);

  let jobId: string;
  try {
    const [row] = await db
      .insert(jobs)
      .values({
        homeownerId: user.id,
        title: d.title,
        category: d.category as TradeCategoryValue,
        description: d.description,
        neighborhood: d.neighborhood,
        photoUrls: d.photoUrls,
        lat,
        lng,
        budgetMin: d.budgetMin != null ? String(d.budgetMin) : null,
        budgetMax: d.budgetMax != null ? String(d.budgetMax) : null,
        status: "open",
        bidWindowClosesAt: new Date(Date.now() + BID_WINDOW_HOURS * 60 * 60 * 1000),
      })
      .returning({ id: jobs.id });
    jobId = row.id;
  } catch (err) {
    console.error("[createJob] failed:", err);
    return { error: "Could not post your job. Try again." };
  }

  revalidatePath("/dashboard");
  redirect(`/jobs/${jobId}`);
}
