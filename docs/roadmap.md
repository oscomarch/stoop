# Roadmap

A working sequencing of work. Each version is scoped to be useful on its own and
to teach us something specific before we move on. We will absolutely re-order
these once we have user data — this is a starting point, not a contract.

## v0.1 — Scaffold (this repo, today)

**What this teaches us:** Whether the brand resonates. Whether the manifesto
attracts the right early signups. Whether the form is conversion-friendly.

- Marketing site (`/`, `/how-it-works`, `/for-tradespeople`, `/manifesto`)
- Two waitlist forms (homeowner + tradesperson) with neighborhood + trade
  selection
- Confirmation email via Resend
- Supabase Auth (email/password) with role on signup
- Authed app shell with role-aware dashboard
- Post a job (homeowner) → DB
- Browse jobs (tradesperson) → DB
- Job detail page (read-only)
- Profile page (read-only)
- Drizzle schema, PostGIS-ready, migrations generated
- Production-ready deploy on Vercel + Supabase
- PostHog page-view tracking
- OG image, favicon, sitemap, robots

**Acceptance:** team can clone, run locally with their own Supabase, deploy to
Vercel, hit the homepage, sign up, post a job, browse it.

## v0.2 — The marketplace actually works

**What this teaches us:** Whether real homeowners convert, whether real pros
bid, whether escrow flows are smooth.

- **Bidding flow**
  - Tradesperson submits a bid (price, message, ETA) on a job
  - Homeowner sees bids in the job detail page
  - Homeowner accepts a bid → job moves to `awarded`
  - Notifications via Resend + (later) SMS
- **In-app messaging** between homeowner and the accepted pro
- **Stripe Connect**
  - Pro onboarding (Stripe Express)
  - Escrow funded by homeowner on bid acceptance
  - Release on job completion
  - Refund/dispute path
- **Job lifecycle**
  - `open` → `awarded` → `in_progress` → `completed` → `reviewed`
  - Mark-complete by pro, approve by homeowner
- **Photo uploads** for job posts (Supabase Storage)
- **Mapbox geocoding** so jobs and pros have real coordinates
- **Soft-launch in 1 Brooklyn neighborhood** (likely Park Slope)
- **Founder ops:** verification interviews, hand-onboarding of first 10 pros
  per trade

**Acceptance:** 10 real jobs run end-to-end, including escrow funding and
release, in one neighborhood.

## v0.3 — Trust layer

**What this teaches us:** Whether the neighbor-distance review primitive actually
drives engagement, whether verified-pro status is worth the operational cost.

- **Reviews**
  - Post-job review form for homeowner (rating + comment)
  - Pro-side review of homeowner (optional, mutual)
  - Capture `reviewer_location` at time of review
  - Distance-ranked review feed on pro profile
  - "Verified neighbor" badge if reviewer is within 250m of viewer
- **Verified-pro program**
  - License-number capture + validation (state lookup APIs where available)
  - Insurance certificate upload + review
  - Identity verification (Checkr or similar)
  - Verified badge on profile + filter on jobs feed
- **Public pro profile pages** with portfolio (Supabase Storage)
- **Trust safety**
  - Report-a-bid (spam, scope-creep, price-gouging)
  - Cancel-with-refund flow with reasonable dispute review

**Acceptance:** 50 verified pros, 200 reviews captured, 80% of homeowners say
the distance-ranked review feed was the deciding factor.

## v0.4 — Tradesperson business OS

**What this teaches us:** Whether bundling back-office tooling drives retention
and reduces pro churn vs. competitors.

- **Calendar**
  - View all bids, accepted jobs, confirmed appointments
  - Automatic SMS reminders to clients
  - Block-out times (recurring weekly off-days, vacations)
- **Invoicing**
  - Auto-generated PDF invoices on each completed job
  - Custom logo + business info
  - CSV export of all earnings
- **Receipts** for homeowners (PDF, emailed on payment release)
- **Tax-ready earnings**
  - Quarterly + annual summaries
  - 1099 prep when applicable
- **Multi-job batching** — propose a maintenance plan for an annual homeowner
- **Optional**: simple expense tracking (parts, supplies)

**Acceptance:** 50% of v0.3 pros adopt the calendar feature; <10% monthly churn.

## v1.0 — Public launch

**What this teaches us:** Whether the playbook scales beyond hand-recruiting.

- Multi-neighborhood: at least 3 Brooklyn neighborhoods fully liquid
- Marketing site for SEO: trade-specific landing pages (`/plumber/park-slope`,
  etc.)
- Press push (TechCrunch, The Verge, Curbed, Brownstoner)
- Referral program (homeowner → homeowner, pro → pro)
- Subway ads, neighborhood postering (lean into the brand)
- Open hiring (first non-founder employees)

## v1.5+ — Beyond Brooklyn

- Manhattan brownstone-equivalent neighborhoods (West Village, UWS pre-war, etc.)
- Queens (Astoria, Forest Hills)
- Jersey City + Hoboken
- Adjacent trades (cleaning, moving, HVAC, locksmith) — only when we've nailed
  the original 5
- Native iOS app (Expo or fully native — TBD based on pro usage patterns)
- Native Android app

## v2.0+ — Adjacent products

Speculative. To be revisited in 18 months.

- **Stoop Maintenance** — annual maintenance plans for homeowners with the
  verified pros on their block
- **Stoop Insurance** — partnered home-insurance with maintenance verification
  discounts
- **Stoop for property managers** — a different product surface for landlords +
  building supers

---

## Cross-cutting workstreams

These don't fit neatly into a version but progress in parallel.

### Trust & safety

- v0.1: basic profanity filter, manual moderation
- v0.2: reportable bids
- v0.3: license verification, identity verification
- v0.4: dispute review SLA, automated fraud signals

### Pricing / take rate

- v0.1: 12% take, $0 platform fees on homeowner side
- v0.2: revisit after 50 closed jobs
- v0.3: introduce repeat-customer discount (0% take after job 1 with the same
  customer)

### Compliance

- v0.2: Stripe Connect KYC compliance
- v0.3: NYC home improvement contractor license verification + matching
- v1.0: insurance audit + liability framework

### Brand & marketing

- v0.1: brand kit, manifesto, OG, landing pages
- v0.2: neighborhood-specific marketing pages
- v0.3: real customer testimonial videos
- v1.0: subway/postering campaign
