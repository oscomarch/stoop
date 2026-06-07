/**
 * Stoop database schema (Drizzle ORM) - blind-bidding marketplace.
 *
 * This mirrors drizzle/0001_blind_bidding_marketplace.sql. The SQL file is the
 * source of truth for RLS, triggers, generated columns, and feed functions;
 * this file is the source of truth for TypeScript query types.
 *
 * Conventions:
 * - `id` is a uuid PK. For `users` it equals `auth.users.id` (Supabase).
 * - Geographic columns use PostGIS `geography(Point, 4326)`. `location` /
 *   `home_base` are GENERATED in Postgres from `lat`/`lng`, so never write them.
 * - RLS is the real security boundary. Drizzle connects as `postgres` (bypasses
 *   RLS) for privileged server logic; the Supabase client enforces RLS.
 */

import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  jsonb,
  date,
  doublePrecision,
  customType,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  PostGIS geography type                                                    */
/* -------------------------------------------------------------------------- */

export const geography = customType<{ data: string; driverData: string }>({
  dataType() {
    return "geography(Point, 4326)";
  },
});

/* -------------------------------------------------------------------------- */
/*  Enums                                                                     */
/* -------------------------------------------------------------------------- */

export const userRole = pgEnum("user_role", ["homeowner", "contractor", "admin"]);

export const tradeCategory = pgEnum("trade_category", [
  "handyman",
  "plumbing",
  "electrical",
  "painting",
  "appliance_repair",
]);

export const jobStatus = pgEnum("job_status", [
  "open",
  "bidding_closed",
  "hired",
  "in_progress",
  "completed",
  "reviewed",
  "cancelled",
]);

export const bidStatus = pgEnum("bid_status", ["pending", "won", "lost", "withdrawn"]);

export const escrowStatus = pgEnum("escrow_status", [
  "pending",
  "held",
  "released",
  "refunded",
  "disputed",
]);

export const waitlistRole = pgEnum("waitlist_role", ["homeowner", "tradesperson"]);

/* -------------------------------------------------------------------------- */
/*  users                                                                     */
/* -------------------------------------------------------------------------- */

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  phone: text("phone"),
  email: text("email"),
  name: text("name"),
  photoUrl: text("photo_url"),
  role: userRole("role").notNull().default("homeowner"),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  contractor_profiles                                                       */
/* -------------------------------------------------------------------------- */

export const contractorProfiles = pgTable("contractor_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  businessName: text("business_name"),
  bio: text("bio"),
  /** Mirrors the trade_category enum values. */
  tradeCategories: text("trade_categories").array().notNull().default(sql`'{}'`),
  serviceRadiusKm: integer("service_radius_km").notNull().default(8),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  /** GENERATED from lat/lng in Postgres. Never write directly. */
  homeBase: geography("home_base"),
  licenseUrl: text("license_url"),
  avgResponseTimeMins: integer("avg_response_time_mins"),
  completionRate: numeric("completion_rate", { precision: 5, scale: 2 }),
  ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 }),
  jobsCompleted: integer("jobs_completed").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  jobs                                                                      */
/* -------------------------------------------------------------------------- */

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    homeownerId: uuid("homeowner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    category: tradeCategory("category").notNull(),
    description: text("description").notNull(),
    photoUrls: text("photo_urls").array().notNull().default(sql`'{}'`),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    neighborhood: text("neighborhood"),
    /** GENERATED from lat/lng in Postgres. Never write directly. */
    location: geography("location"),
    budgetMin: numeric("budget_min", { precision: 10, scale: 2 }),
    budgetMax: numeric("budget_max", { precision: 10, scale: 2 }),
    status: jobStatus("status").notNull().default("open"),
    bidWindowClosesAt: timestamp("bid_window_closes_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    homeownerIdx: index("jobs_homeowner_idx").on(t.homeownerId),
    statusIdx: index("jobs_status_idx").on(t.status),
    categoryIdx: index("jobs_category_idx").on(t.category),
  })
);

/* -------------------------------------------------------------------------- */
/*  bids                                                                      */
/* -------------------------------------------------------------------------- */

export const bids = pgTable(
  "bids",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    contractorId: uuid("contractor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    startDate: date("start_date"),
    estCompletionDays: integer("est_completion_days"),
    pitch: text("pitch"),
    status: bidStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    jobIdx: index("bids_job_idx").on(t.jobId),
    contractorIdx: index("bids_contractor_idx").on(t.contractorId),
    oneBidPerContractor: uniqueIndex("bids_job_contractor_key").on(t.jobId, t.contractorId),
  })
);

/* -------------------------------------------------------------------------- */
/*  contracts (escrow)                                                        */
/* -------------------------------------------------------------------------- */

export const contracts = pgTable(
  "contracts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .unique()
      .references(() => jobs.id, { onDelete: "cascade" }),
    winningBidId: uuid("winning_bid_id")
      .notNull()
      .references(() => bids.id),
    contractorId: uuid("contractor_id")
      .notNull()
      .references(() => users.id),
    homeownerId: uuid("homeowner_id")
      .notNull()
      .references(() => users.id),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    platformFee: numeric("platform_fee", { precision: 10, scale: 2 }).notNull().default("0"),
    escrowPaymentIntentId: text("escrow_payment_intent_id"),
    escrowStatus: escrowStatus("escrow_status").notNull().default("pending"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    contractorIdx: index("contracts_contractor_idx").on(t.contractorId),
    homeownerIdx: index("contracts_homeowner_idx").on(t.homeownerId),
  })
);

/* -------------------------------------------------------------------------- */
/*  reviews (multi-dimensional + neighbor-distance signal)                    */
/* -------------------------------------------------------------------------- */

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
    reviewerId: uuid("reviewer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    revieweeId: uuid("reviewee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    quality: integer("quality").notNull(),
    punctuality: integer("punctuality").notNull(),
    cleanliness: integer("cleanliness").notNull(),
    communication: integer("communication").notNull(),
    comment: text("comment"),
    photoUrl: text("photo_url"),
    reviewerLocation: geography("reviewer_location"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    revieweeIdx: index("reviews_reviewee_idx").on(t.revieweeId),
    reviewerIdx: index("reviews_reviewer_idx").on(t.reviewerId),
  })
);

/* -------------------------------------------------------------------------- */
/*  questions (lightweight Q&A)                                               */
/* -------------------------------------------------------------------------- */

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    askerId: uuid("asker_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    answerBody: text("answer_body"),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    jobIdx: index("questions_job_idx").on(t.jobId),
  })
);

/* -------------------------------------------------------------------------- */
/*  notifications                                                             */
/* -------------------------------------------------------------------------- */

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    payload: jsonb("payload").notNull().default(sql`'{}'::jsonb`),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("notifications_user_idx").on(t.userId, t.read),
  })
);

/* -------------------------------------------------------------------------- */
/*  waitlist (unchanged from v0.1)                                            */
/* -------------------------------------------------------------------------- */

export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    role: waitlistRole("role").notNull(),
    neighborhood: text("neighborhood"),
    tradesInterested: text("trades_interested").array().default(sql`'{}'`),
    referralSource: text("referral_source"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailRoleIdx: uniqueIndex("waitlist_email_role_idx").on(t.email, t.role),
  })
);

/* -------------------------------------------------------------------------- */
/*  Convenience types                                                         */
/* -------------------------------------------------------------------------- */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ContractorProfile = typeof contractorProfiles.$inferSelect;
export type NewContractorProfile = typeof contractorProfiles.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type WaitlistEntry = typeof waitlist.$inferSelect;
export type NewWaitlistEntry = typeof waitlist.$inferInsert;

export const TRADE_CATEGORY_VALUES = tradeCategory.enumValues;
export type TradeCategoryValue = (typeof tradeCategory.enumValues)[number];
