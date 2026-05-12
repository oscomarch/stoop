<div align="center">

# Stoop

**Ask your stoop.**

The neighborhood marketplace for home services. Built for Brooklyn brownstones — then everywhere.

</div>

---

> Trust is the broken part of home services.
> Homeowners gamble on Yelp, Facebook Marketplace, and sketchy referrals.
> Tradespeople pay $40+ per cold lead just to talk to someone who never answers.
> Both lose. The platforms that monetize the confusion win.
>
> Stoop is a small bet on something old: the people who live near you are the best
> authority on who to trust with your home. We're rebuilding home services around
> that idea — block by block — starting in Brooklyn.

## Contents

- [What Stoop is](#what-stoop-is)
- [Why Brooklyn brownstones](#why-brooklyn-brownstones)
- [The neighbor-trust primitive](#the-neighbor-trust-primitive)
- [Product surface](#product-surface)
- [Business model](#business-model)
- [Competitive landscape](#competitive-landscape)
- [Tech stack](#tech-stack)
- [Local development](#local-development)
- [Deploying](#deploying)
- [Repo structure](#repo-structure)
- [Roadmap](#roadmap)
- [Team](#team)

## What Stoop is

Stoop is two things wearing one trench coat:

1. **A marketplace.** Homeowners post jobs (handyman, plumbing, electrical, painting,
   appliance repair). Vetted tradespeople nearby bid. The homeowner picks one. Money
   is held in escrow until the work is done.
2. **A trust graph.** Every review is anchored to the reviewer's street. When you
   look up a pro, you see what your *actual* neighbors said — ranked by how close
   they live to you. Over time this becomes a local trust graph that no other
   platform can replicate.

We're starting narrow on purpose:

- **One geography:** Brooklyn brownstone neighborhoods (Park Slope, Cobble Hill,
  Carroll Gardens, Boerum Hill, Fort Greene, Clinton Hill, Bed-Stuy, Crown Heights,
  Prospect Heights, and adjacent).
- **Five trades:** handyman, plumbing, electrical, painting, appliance repair.
  Covers ~80% of brownstone home maintenance.
- **One product surface to start:** web (Next.js, mobile-friendly). Native apps in v0.4.

See [`docs/why-brooklyn.md`](docs/why-brooklyn.md) for the full justification of
the beachhead.

## Why Brooklyn brownstones

A trust-based marketplace only works if **density** is real. Density of *homeowners*,
specifically — not just population.

We chose Brooklyn brownstone neighborhoods because they are the highest-density,
highest-homeowner-identity neighborhoods within commuting distance of our team.
They are the most ideal lab on Earth for a neighbor-trust marketplace:

- High owner-occupancy in row-house neighborhoods (40–60%+ in target neighborhoods,
  vs. ~25% Manhattan-wide).
- Walkable supply acquisition — we can hand-deliver early tradespeople and homeowners.
- "Block identity" culture (people identify with Garfield Pl, not just "Brooklyn").
- Existing informal trust networks (block associations, neighborhood Facebook groups,
  parent listservs) that we can plug into.
- Subway-accessible from Columbia, where two of our founders are based.

Full numbers and rationale in [`docs/why-brooklyn.md`](docs/why-brooklyn.md).

## The neighbor-trust primitive

Every review on Stoop captures the reviewer's geographic point at the time of the
review (`reviews.reviewer_location`, PostGIS `geography(Point, 4326)`).

When you view a pro, we run roughly this query:

```sql
SELECT r.*, ST_Distance(r.reviewer_location, $viewer_location) AS distance_m
FROM reviews r
WHERE r.subject_user_id = $pro_id
ORDER BY distance_m ASC NULLS LAST
LIMIT 10;
```

The result is a review feed that **shows you what your closest neighbors said first.**
"Sarah from 2 doors down on Garfield Pl" beats "Sarah from 4 miles away" every time.

Once we hit density in even a single neighborhood, the moat compounds: any competitor
copying the *feature* still has to recruit reviewers from the same blocks we already
saturated.

## Product surface

```
                ┌──────────────────┐
                │   Marketing site │
                │   (this repo)    │
                └────────┬─────────┘
                         │ join waitlist
                         ▼
            ┌─────────────────────────┐
            │  Supabase Auth + users  │
            └──┬───────────────────┬──┘
   homeowner   │                   │   tradesperson
               ▼                   ▼
    ┌─────────────────┐   ┌──────────────────┐
    │  Post a job     │   │  Browse jobs     │
    │  Track bids     │   │  Submit bids     │
    │  Pay via escrow │   │  Run business    │
    │  Review pros    │   │  Get reviewed    │
    └─────────────────┘   └──────────────────┘
                 │                   │
                 ▼                   ▼
            ┌─────────────────────────┐
            │  Neighbor-trust graph    │
            │  (reviews by distance)   │
            └─────────────────────────┘
```

v0.1 (this scaffold) covers everything up to and including job posting, bid browsing,
and a profile stub. Escrow + bids + reviews + verification follow in v0.2/v0.3. See
[`docs/roadmap.md`](docs/roadmap.md).

## Business model

Short version: **escrow + take rate**, no cold-lead fees.

| Lever                      | Default                                        | Notes                                                                 |
| -------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| Homeowner fee              | **0%** at launch                               | Reconsider once supply density is real.                               |
| Tradesperson fee per job   | **12%** of accepted bid                        | Charged only on jobs the platform helped them win.                    |
| Subscription               | **$0**                                         | No monthly fees, ever. The 12% is the only number to remember.        |
| Listing & bidding          | **Free**                                       | Unlimited bids, unlike Thumbtack/Angi pay-per-lead.                   |
| Payment processing         | **Included**                                   | Card + ACH fees baked into the 12%. No surprise Stripe charges.       |
| Repeat-customer discount   | **0% after first job with the same customer**  | We get rewarded for matchmaking, not for taxing relationships.        |

**Status:** provisional, TBD-able by the founders. Full unit economics, sensitivity
analysis, and alternatives (Airbnb-style 3% + 12% split, etc.) are in
[`docs/business-model.md`](docs/business-model.md).

## Competitive landscape

Why the incumbents leave a window for Stoop:

- **Thumbtack / Angi (HomeAdvisor)** — Pay-per-cold-lead model. Pros hate it. Quality
  is a race to the bottom. No escrow.
- **TaskRabbit (IKEA / Apple-owned)** — Strong on micro-tasks (assembly, moving),
  weak on licensed trades and on long-term retention. No real business OS for pros.
- **Yelp / Google Maps** — Discovery without trust. Reviews are gameable, paid
  placements distort rankings.
- **Facebook Marketplace / Nextdoor** — Real social proof, zero infrastructure
  (no payments, no scheduling, no recourse).
- **Houzz** — Design-led, premium-projects-focused. Different segment.
- **Jobber / Housecall Pro** — Beloved by pros for back-office, but they don't bring
  the customer. Pros still need leads from somewhere.

Detailed teardown of each in [`docs/competitive-landscape.md`](docs/competitive-landscape.md).

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + shadcn-style primitives
- **Database:** [Supabase](https://supabase.com) Postgres + PostGIS (auth, db, storage in one)
- **ORM:** [Drizzle](https://orm.drizzle.team) (`postgres-js` driver)
- **Auth:** Supabase Auth (`@supabase/ssr`)
- **Email:** [Resend](https://resend.com) (transactional)
- **Hosting:** [Vercel](https://vercel.com)
- **Maps:** [Mapbox](https://www.mapbox.com) (planned, for distance-based review ranking)
- **Analytics:** [PostHog](https://posthog.com) (with manual `$pageview` capture)
- **Error tracking:** Sentry — *planned, not yet wired.* See [`docs/roadmap.md`](docs/roadmap.md).
- **Payments:** [Stripe Connect](https://stripe.com/connect) (planned, v0.2)

Why this stack? Read the AGENTS.md note: this Next.js version is fresh; the team
should consult `node_modules/next/dist/docs/` before adding novel features.

## Local development

### Prerequisites

- Node.js **20.x** or **22.x** (`node --version`)
- npm 10+ (or pnpm — we use npm; if you prefer pnpm, run `pnpm import` after `pnpm install`)
- A Supabase project (free tier is enough)
- A Resend API key (free tier)
- Optional: Mapbox token, PostHog key

### 1. Clone and install

```bash
git clone <repo-url> stoop
cd stoop
npm install
```

### 2. Configure environment

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

You need at minimum:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase
  Project Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY` — same place. Server-only. Never commit.
- `DATABASE_URL` — Supabase → Project Settings → Database → Connection string
  (use the **pooler** URL for Vercel, the direct URL works locally).
- `RESEND_API_KEY` — Resend dashboard.
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` in dev.

### 3. Enable PostGIS in Supabase

In the Supabase dashboard: **Database → Extensions → search "postgis" → Enable**.
(Or run `CREATE EXTENSION IF NOT EXISTS postgis;` in the SQL editor.)

The first migration also runs this, but enabling via the dashboard is faster.

### 4. Run database migrations

```bash
npm run db:push
```

This applies `drizzle/0000_initial_schema.sql` to your Supabase database.

> If you change `lib/db/schema.ts`, regenerate the migration with
> `npm run db:generate` and re-run `npm run db:push`.

### 5. Configure Supabase Auth

- **Authentication → URL Configuration:**
  - Site URL: `http://localhost:3000`
  - Redirect URLs: `http://localhost:3000/auth/callback`, plus your Vercel preview/prod URLs
- **Authentication → Email Templates:** customize as you like. The confirmation
  link should keep the default `?code=...` parameter.

### 6. Run the app

```bash
npm run dev
```

Open [`http://localhost:3000`](http://localhost:3000).

### Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (`http://localhost:3000`) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript without emitting |
| `npm run db:generate` | Regenerate Drizzle migrations after schema changes |
| `npm run db:push` | Apply schema changes to the database |
| `npm run db:studio` | Open Drizzle Studio (db browser) |

## Deploying

### Vercel + Supabase (recommended path)

1. Push the repo to GitHub.
2. In Vercel, import the repo. Framework will autodetect as Next.js.
3. Add all the environment variables from `.env.example` to Vercel's
   **Environment Variables** (Production + Preview).
4. Use the Supabase **pooler** connection string for `DATABASE_URL` on Vercel
   (port 6543, not 5432) — Vercel's serverless functions need PgBouncer-style pooling.
5. Add your Vercel production URL and preview URL pattern to Supabase
   **Authentication → URL Configuration → Redirect URLs**.
6. Each push to `main` deploys to production. Each PR gets a preview deploy with
   the same env vars (good for async collaboration).

### Domain

When we lock the domain, update:

- `NEXT_PUBLIC_SITE_URL` in Vercel env vars
- `metadataBase` in [`app/layout.tsx`](app/layout.tsx)
- Supabase redirect URLs

Candidate domains under consideration: `stoopapp.com`, `stoop.so`, `getstoop.com`,
`hellostoop.com`. **TBD — founder decision.**

## Repo structure

```
.
├── app/
│   ├── (marketing)/                  Public marketing pages (under MarketingLayout)
│   │   ├── for-tradespeople/
│   │   ├── how-it-works/
│   │   └── manifesto/
│   ├── (auth)/                       Sign-in / sign-up flows
│   │   ├── actions.ts                Server Actions (signUp, signIn, signOut)
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (app)/                        Authed product surface
│   │   ├── dashboard/                Role-aware home screen
│   │   ├── jobs/                     Post / browse / view jobs
│   │   ├── profile/                  User profile stub
│   │   └── layout.tsx                Wraps with AppNav, requires auth
│   ├── api/
│   │   └── waitlist/                 POST /api/waitlist (DB + Resend email)
│   ├── auth/callback/                Supabase email confirmation handler
│   ├── icon.tsx                      Favicon (dynamic)
│   ├── opengraph-image.tsx           OG image (dynamic)
│   ├── robots.ts                     /robots.txt
│   ├── sitemap.ts                    /sitemap.xml
│   ├── globals.css                   Tailwind v4 + brand tokens
│   ├── layout.tsx                    Root layout (fonts, PostHog)
│   └── page.tsx                      Marketing homepage
├── components/
│   ├── analytics/                    PostHog provider
│   ├── app/                          Authed UI (AppNav, JobCard)
│   ├── brand/                        Logo
│   ├── marketing/                    Landing-page sections
│   └── ui/                           shadcn-style primitives (Button, Input, …)
├── drizzle/                          Generated SQL migrations + meta
├── lib/
│   ├── auth.ts                       requireUser / requireRole helpers
│   ├── constants.ts                  Trades, neighborhoods, brand
│   ├── db/                           Drizzle schema + client
│   ├── email.ts                      Resend email rendering
│   ├── env.ts                        Centralized env var access
│   ├── supabase/                     Browser / server / middleware clients
│   └── utils.ts                      cn, formatCurrency, relativeTime
├── docs/                             Founding docs (read these next)
├── proxy.ts                          Refreshes Supabase session, protects /app routes (Next.js 16 "proxy" convention; formerly middleware.ts)
├── drizzle.config.ts                 Drizzle Kit config
├── next.config.ts
├── tailwind.config.ts                Empty — all theming lives in app/globals.css
├── tsconfig.json
└── package.json
```

## Roadmap

| Version | Theme | Highlights |
| --- | --- | --- |
| **v0.1** (this scaffold) | Marketing + signup + post-a-job skeleton | Landing, waitlist, auth, dashboard, post/browse jobs, profile stub |
| **v0.2** | The actual marketplace | Bidding, in-app messaging, accept-bid flow, basic Stripe Connect escrow, neighborhood seeding |
| **v0.3** | Trust layer | Verified-pro program (license + insurance + identity), neighbor-trust review primitive, distance-ranked review feed |
| **v0.4** | Tradesperson business OS | Calendar, invoices, receipts, SMS reminders, tax-ready earnings export |
| **v1.0** | Public launch | One Brooklyn neighborhood fully live, marketing push, press, paid acquisition |

Full sequencing and milestones in [`docs/roadmap.md`](docs/roadmap.md).

## Open questions / decisions to make

These are explicitly not locked yet — file an issue or discuss in person:

- Final domain choice
- Final take-rate model (12% all-on-pro vs. Airbnb-style 3% + 12% split)
- Verification vendor (Checkr for background checks? Self-service license number lookup?)
- First marketing motion (door-to-door at one block vs. Instagram targeting vs. Columbia network)
- Sentry vs. Highlight vs. nothing for error tracking
- Whether to do native apps at v0.4 or push them to v1.5

## Team

The founders:

- **Oscar** — building
- **Radoslav Kolev** — Columbia CS
- **Nick** — Columbia CS

Email us at [hello@stoop.app](mailto:hello@stoop.app) (placeholder, until DNS is real).

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Built in Brooklyn, with care, for the people who actually live on the block.</sub>
