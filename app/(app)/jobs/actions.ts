"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { TRADES, BROOKLYN_NEIGHBORHOODS, type TradeId } from "@/lib/constants";

const tradeIds = TRADES.map((t) => t.id) as [TradeId, ...TradeId[]];

const postJobSchema = z.object({
  trade: z.enum(tradeIds),
  title: z.string().min(5, "Give your job a clear title.").max(120),
  description: z.string().min(20, "A bit more detail helps pros bid accurately.").max(4000),
  budgetLow: z
    .union([z.coerce.number().min(0), z.literal("")])
    .transform((v) => (v === "" ? null : Number(v))),
  budgetHigh: z
    .union([z.coerce.number().min(0), z.literal("")])
    .transform((v) => (v === "" ? null : Number(v))),
  urgency: z.enum(["flexible", "this_week", "asap"]).default("flexible"),
  neighborhood: z
    .enum(BROOKLYN_NEIGHBORHOODS as unknown as [string, ...string[]])
    .nullable()
    .optional(),
});

export type PostJobState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof z.input<typeof postJobSchema>, string>>;
};

export async function postJob(
  _prev: PostJobState | undefined,
  formData: FormData
): Promise<PostJobState> {
  const user = await requireRole("homeowner");

  const parsed = postJobSchema.safeParse({
    trade: formData.get("trade"),
    title: formData.get("title"),
    description: formData.get("description"),
    budgetLow: formData.get("budgetLow") ?? "",
    budgetHigh: formData.get("budgetHigh") ?? "",
    urgency: formData.get("urgency") ?? "flexible",
    neighborhood: formData.get("neighborhood") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: PostJobState["fieldErrors"] = {};
    for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (v && v[0]) fieldErrors[k as keyof typeof fieldErrors] = v[0];
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const data = parsed.data;

  let newJobId: string | null = null;
  try {
    const [row] = await db
      .insert(jobs)
      .values({
        homeownerId: user.id,
        trade: data.trade,
        title: data.title,
        description: data.description,
        budgetLow: data.budgetLow != null ? String(data.budgetLow) : null,
        budgetHigh: data.budgetHigh != null ? String(data.budgetHigh) : null,
        urgency: data.urgency,
        neighborhood: data.neighborhood ?? null,
      })
      .returning({ id: jobs.id });
    newJobId = row?.id ?? null;
  } catch (err) {
    console.error("[postJob] DB insert failed:", err);
    return { error: "We couldn't save your job. Try again in a moment." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  redirect(newJobId ? `/jobs/${newJobId}` : "/dashboard");
}
