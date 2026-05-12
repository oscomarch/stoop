-- Stoop initial schema. Required extensions first.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS "postgis";--> statement-breakpoint
CREATE TYPE "public"."bid_status" AS ENUM('pending', 'accepted', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('open', 'awarded', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."job_urgency" AS ENUM('flexible', 'this_week', 'asap');--> statement-breakpoint
CREATE TYPE "public"."trade_category" AS ENUM('handyman', 'plumbing', 'electrical', 'painting', 'appliance_repair');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('homeowner', 'tradesperson', 'admin');--> statement-breakpoint
CREATE TYPE "public"."waitlist_role" AS ENUM('homeowner', 'tradesperson');--> statement-breakpoint
CREATE TABLE "bids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"tradesperson_id" uuid NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"message" text,
	"eta_days" integer,
	"status" "bid_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homeowner_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"address_line" text,
	"neighborhood" text,
	"location" geography(Point, 4326),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"homeowner_id" uuid NOT NULL,
	"trade" "trade_category" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"photos" text[] DEFAULT '{}' NOT NULL,
	"budget_low" numeric(10, 2),
	"budget_high" numeric(10, 2),
	"urgency" "job_urgency" DEFAULT 'flexible' NOT NULL,
	"status" "job_status" DEFAULT 'open' NOT NULL,
	"location" geography(Point, 4326),
	"neighborhood" text,
	"awarded_bid_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"subject_user_id" uuid NOT NULL,
	"job_id" uuid,
	"rating" integer NOT NULL,
	"comment" text,
	"reviewer_location" geography(Point, 4326),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tradesperson_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"business_name" text,
	"bio" text,
	"trades" text[] DEFAULT '{}' NOT NULL,
	"years_experience" integer,
	"license_number" text,
	"insurance_carrier" text,
	"hourly_rate_low" numeric(10, 2),
	"hourly_rate_high" numeric(10, 2),
	"home_base" geography(Point, 4326),
	"service_radius_meters" integer DEFAULT 8000,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" "user_role" NOT NULL,
	"phone" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" "waitlist_role" NOT NULL,
	"neighborhood" text,
	"trades_interested" text[] DEFAULT '{}',
	"referral_source" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_tradesperson_id_users_id_fk" FOREIGN KEY ("tradesperson_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homeowner_profiles" ADD CONSTRAINT "homeowner_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_homeowner_id_users_id_fk" FOREIGN KEY ("homeowner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_subject_user_id_users_id_fk" FOREIGN KEY ("subject_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tradesperson_profiles" ADD CONSTRAINT "tradesperson_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bids_job_idx" ON "bids" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "bids_tradesperson_idx" ON "bids" USING btree ("tradesperson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bids_unique_active" ON "bids" USING btree ("job_id","tradesperson_id");--> statement-breakpoint
CREATE INDEX "jobs_homeowner_idx" ON "jobs" USING btree ("homeowner_id");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jobs_trade_idx" ON "jobs" USING btree ("trade");--> statement-breakpoint
CREATE INDEX "reviews_subject_idx" ON "reviews" USING btree ("subject_user_id");--> statement-breakpoint
CREATE INDEX "reviews_reviewer_idx" ON "reviews" USING btree ("reviewer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_email_role_idx" ON "waitlist" USING btree ("email","role");