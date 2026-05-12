import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { waitlist } from "@/lib/db/schema";
import { sendWaitlistConfirmation } from "@/lib/email";
import { TRADES, BROOKLYN_NEIGHBORHOODS } from "@/lib/constants";

const tradeIds = TRADES.map((t) => t.id) as [string, ...string[]];

const payloadSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  role: z.enum(["homeowner", "tradesperson"]),
  neighborhood: z
    .enum(BROOKLYN_NEIGHBORHOODS as unknown as [string, ...string[]])
    .nullable()
    .optional(),
  tradesInterested: z.array(z.enum(tradeIds)).optional().default([]),
  referralSource: z.string().max(200).nullable().optional(),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid form input.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    await db
      .insert(waitlist)
      .values({
        email: data.email,
        role: data.role,
        neighborhood: data.neighborhood ?? null,
        tradesInterested: data.tradesInterested,
        referralSource: data.referralSource ?? null,
      })
      .onConflictDoNothing({
        target: [waitlist.email, waitlist.role],
      });
  } catch (err) {
    console.error("[waitlist] DB insert failed:", err);
    return NextResponse.json(
      { error: "We hit a snag saving your entry. Please try again." },
      { status: 500 }
    );
  }

  // Confirmation email is best-effort. If it fails, the waitlist entry is
  // still saved and we'll re-send later. Don't fail the user-facing request.
  try {
    await sendWaitlistConfirmation({
      to: data.email,
      role: data.role,
      neighborhood: data.neighborhood ?? null,
    });
  } catch (err) {
    console.error("[waitlist] Email send failed:", err);
  }

  return NextResponse.json({ ok: true });
}
