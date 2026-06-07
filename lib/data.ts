import { eq, desc, and } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  contractorProfiles,
  users,
  jobs,
  reviews,
  contracts,
  type ContractorProfile,
  type User,
  type Job,
} from "@/lib/db/schema";

/**
 * Server-side read helpers. These run through Drizzle (the `postgres` role,
 * which bypasses RLS), so callers are responsible for only exposing data the
 * viewer is allowed to see. Use for public pages and owner-scoped queries.
 */

export async function getContractorProfile(
  userId: string
): Promise<ContractorProfile | null> {
  const [row] = await db
    .select()
    .from(contractorProfiles)
    .where(eq(contractorProfiles.userId, userId))
    .limit(1);
  return row ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

export async function getJobsForHomeowner(homeownerId: string): Promise<Job[]> {
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.homeownerId, homeownerId))
    .orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: string): Promise<Job | null> {
  const [row] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return row ?? null;
}

export type PublicContractor = {
  user: Pick<User, "id" | "name" | "photoUrl" | "createdAt">;
  profile: ContractorProfile;
};

export async function getPublicContractor(
  userId: string
): Promise<PublicContractor | null> {
  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      photoUrl: users.photoUrl,
      createdAt: users.createdAt,
      profile: contractorProfiles,
    })
    .from(users)
    .innerJoin(contractorProfiles, eq(contractorProfiles.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) return null;
  return {
    user: { id: row.id, name: row.name, photoUrl: row.photoUrl, createdAt: row.createdAt },
    profile: row.profile,
  };
}

export async function getReviewsForUser(userId: string) {
  return db
    .select({
      id: reviews.id,
      quality: reviews.quality,
      punctuality: reviews.punctuality,
      cleanliness: reviews.cleanliness,
      communication: reviews.communication,
      comment: reviews.comment,
      photoUrl: reviews.photoUrl,
      createdAt: reviews.createdAt,
      reviewerName: users.name,
      reviewerPhotoUrl: users.photoUrl,
    })
    .from(reviews)
    .innerJoin(users, eq(users.id, reviews.reviewerId))
    .where(eq(reviews.revieweeId, userId))
    .orderBy(desc(reviews.createdAt));
}

/** Completed jobs done by a contractor, for their public "past work" section. */
export async function getCompletedJobsForContractor(contractorId: string) {
  return db
    .select({
      id: jobs.id,
      title: jobs.title,
      category: jobs.category,
      neighborhood: jobs.neighborhood,
      photoUrls: jobs.photoUrls,
      completedAt: contracts.completedAt,
    })
    .from(contracts)
    .innerJoin(jobs, eq(jobs.id, contracts.jobId))
    .where(and(eq(contracts.contractorId, contractorId), eq(jobs.status, "completed")))
    .orderBy(desc(contracts.completedAt));
}
