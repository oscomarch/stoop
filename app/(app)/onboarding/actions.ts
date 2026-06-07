"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { users, contractorProfiles } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { TRADES, BROOKLYN_NEIGHBORHOODS, neighborhoodToLatLng } from "@/lib/constants";

const TRADE_IDS = TRADES.map((t) => t.id) as [string, ...string[]];
const NEIGHBORHOODS = BROOKLYN_NEIGHBORHOODS as readonly string[];

const schema = z.object({
  name: z.string().trim().min(1, "Tell us your name.").max(80),
  businessName: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(600).optional(),
  neighborhood: z
    .string()
    .refine((n) => NEIGHBORHOODS.includes(n), "Pick your home base."),
  serviceRadiusKm: z.coerce.number().int().min(1).max(40),
  tradeCategories: z
    .array(z.enum(TRADE_IDS))
    .min(1, "Pick at least one trade.")
    .max(TRADE_IDS.length),
  photoUrl: z.string().url().optional().or(z.literal("")),
  licenseUrl: z.string().optional(),
  redirectTo: z.string().optional(),
});

export type ContractorProfileInput = z.input<typeof schema>;
export type ProfileActionState = { error?: string };

export async function saveContractorProfile(
  input: ContractorProfileInput
): Promise<ProfileActionState | void> {
  const user = await requireUser();

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;
  const { lat, lng } = neighborhoodToLatLng(d.neighborhood);

  try {
    await db
      .insert(contractorProfiles)
      .values({
        userId: user.id,
        businessName: d.businessName || null,
        bio: d.bio || null,
        tradeCategories: d.tradeCategories,
        serviceRadiusKm: d.serviceRadiusKm,
        lat,
        lng,
        licenseUrl: d.licenseUrl || null,
      })
      .onConflictDoUpdate({
        target: contractorProfiles.userId,
        set: {
          businessName: d.businessName || null,
          bio: d.bio || null,
          tradeCategories: d.tradeCategories,
          serviceRadiusKm: d.serviceRadiusKm,
          lat,
          lng,
          ...(d.licenseUrl ? { licenseUrl: d.licenseUrl } : {}),
          updatedAt: new Date(),
        },
      });

    await db
      .update(users)
      .set({
        name: d.name,
        role: "contractor",
        ...(d.photoUrl ? { photoUrl: d.photoUrl } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
  } catch (err) {
    console.error("[saveContractorProfile] failed:", err);
    return { error: "Could not save your profile. Try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  redirect(d.redirectTo && d.redirectTo.startsWith("/") ? d.redirectTo : "/dashboard");
}
