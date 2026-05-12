<div align="center">

# Stoop

**Ask your stoop.**

The neighborhood marketplace for home services. Brooklyn brownstones first, then everywhere else.

</div>

---

> If you needed a babysitter, you'd ask the family two doors down before you'd open Yelp.
> Hiring a plumber should work the same way. Right now it doesn't. Homeowners gamble on
> Facebook Marketplace and sketchy referrals. Plumbers pay $40 a pop for cold leads from
> Angi that ghost them. Everyone loses except the platforms that monetize the confusion.
>
> Stoop is our shot at fixing that. We start in Brooklyn because we live here, the blocks
> are dense, and people on Garfield Pl already know who the good roofer is. We want to
> make that knowledge portable.

## Contents

- [What Stoop is](#what-stoop-is)
- [Why Brooklyn brownstones](#why-brooklyn-brownstones)
- [The neighbor-trust review feed](#the-neighbor-trust-review-feed)
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

Two pieces, one product:

1. **A marketplace.** Homeowners post jobs (handyman, plumbing, electrical, painting,
   appliance repair). Vetted pros nearby send bids. The homeowner picks one. Money sits
   in escrow until the job is done.
2. **A trust graph.** Every review is tied to the reviewer's street. When you look up a
   pro, you see what your *actual* neighbors said, ranked by physical distance. Over
   time that becomes a local trust graph other platforms can't fake.

We're keeping it narrow on purpose:

- **One geography.** Brooklyn brownstone neighborhoods (Park Slope, Cobble Hill,
  Carroll Gardens, Boerum Hill, Fort Greene, Clinton Hill, Bed-Stuy, Crown Heights,
  Prospect Heights, and the blocks next to them).
- **Five trades.** Handyman, plumbing, electrical, painting, appliance repair. Covers
  about 80% of what a brownstone actually needs done.
- **One product surface to start.** Web (Next.js, mobile-friendly). Native apps come
  later if the data says we need them.

The full justification for the beachhead is in [`docs/why-brooklyn.md`](docs/why-brooklyn.md).

## Why Brooklyn brownstones

A trust-based marketplace only works if there's real density. Not population density,
*homeowner* density. People who'll still be on the same block in two years.

Brooklyn brownstone neighborhoods are the densest pocket of homeowners we can reach by
F train. They're also a real community: people talk on the stoop, parents text each
other about contractors, block associations argue about garbage cans on group chats.
The informal trust network is already there. We just need to give it a product surface.

A few specifics:

- Owner-occupancy in row-house neighborhoods runs 40 to 60%, compared to about 25%
  Manhattan-wide.
- The blocks are walkable, so we can recruit early pros and homeowners in person.
- People here identify with their block, not just "Brooklyn". You're on Garfield Pl
  between 7th and 8th. That granularity is what the review feed is designed for.
- Two of our three founders are at Columbia, one stop away on the F.

Numbers and full rationale: [`docs/why-brooklyn.md`](docs/why-brooklyn.md).

## The neighbor-trust review feed

Every review on Stoop captures the reviewer's geographic point at the time of the
review (`reviews.reviewer_location`, PostGIS `geography(Point, 4326)`).

When you view a pro, the query is roughly this:

```sql
SELECT r.*, ST_Distance(r.reviewer_location, $viewer_location) AS distance_m
FROM reviews r
WHERE r.subject_user_id = $pro_id
ORDER BY distance_m ASC NULLS LAST
LIMIT 10;
```

That returns a review feed that **shows you what your closest neighbors said first.**
"Sarah from 2 doors down on Garfield Pl" hits harder than "Sarah from 4 miles away."

Once we hit density in even one neighborhood, the moat compounds. Any copycat has to
recruit reviewers from the same blocks we already saturated, which takes years.

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
   homeowner   │                   │   pro
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
and a profile stub. Escrow, bidding, reviews, and verification land in v0.2 and v0.3.
See [`docs/roadmap.md`](docs/roadmap.md).

## Business model

Short version: **escrow + take rate**, no cold-lead fees.

| Lever                      | Default                                        | Notes                                                                 |
| -------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| Homeowner fee              | **0%** at launch                               | Reconsider once supply density is real.                               |
| Pro fee per job            | **12%** of accepted bid                        | Charged only on jobs the platform helped them win.                    |
| Subscription               | **$0**                                         | No monthly fees, ever. The 12% is the only number to remember.        |
| Listing & bidding          | **Free**                                       | Unlimited bids, unlike Thumbtack and Angi pay-per-lead.               |
| Payment processing         | **Included**                                   | Card and ACH fees baked into the 12%. No surprise Stripe charges.     |
| Repeat-customer discount   | **0% after first job with the same customer**  | We get paid for matchmaking, not for taxing relationships.            |

Status: provisional. Founders can change it before launch. Unit economics, sensitivity
analysis, and alternative splits (Airbnb-style 3% + 12%, etc.) live in
[`docs/business-model.md`](docs/business-model.md).

## Competitive landscape

Why the incumbents leave a window for us:

- **Thumbtack and Angi (HomeAdvisor).** Pay-per-cold-lead model. Pros hate it. Quality
  becomes a race to the bottom. No escrow.
- **TaskRabbit (Apple-owned).** Strong on micro-tasks (assembly, moving). Weak on
  licensed trades and on long-term retention. No real business OS for pros.
- **Yelp and Google Maps.** Discovery without trust. Reviews are gameable, paid
  placements distort rankings.
- **Facebook Marketplace and Nextdoor.** Real social proof, but zero infrastructure
  (no payments, no scheduling, no recourse if things go wrong).
- **Houzz.** Design-led, premium projects, different segment.
- **Jobber and Housecall Pro.** Beloved by pros for back-office, but they don't bring
  the customer. Pros still need leads from somewhere.

Full teardown of each in [`docs/competitive-landscape.md`](docs/competitive-landscape.md).

## Tech stack

- **Framework.** [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- **Styling.** [Tailwind CSS v4](https://tailwindcss.com) + shadcn-style primitives
- **Database.** [Supabase](https://supabase.com) Postgres + PostGIS (auth, db, storage in one)
- **ORM.** [Drizzle](https://orm.drizzle.team) with the `postgres-js` driver
- **Auth.** Supabase Auth (`@supabase/ssr`)
- **Email.** [Resend](https://resend.com) for transactional mail
- **Hosting.** [Vercel](https://vercel.com)
- **Maps.** [Mapbox](https://www.mapbox.com), planned for distance-based review ranking
- **Analytics.** [PostHog](https://posthog.com), with manual `$pageview` capture
- **Error tracking.** Sentry, *planned, not yet wired.* See [`docs/roadmap.md`](docs/roadmap.md).
- **Payments.** [Stripe Connect](https://stripe.com/connect), planned for v0.2

Why this stack? Read the AGENTS.md note: this Next.js version is fresh, so the team
should consult `node_modules/next/dist/docs/` before adding novel features.

## Local development

### Prerequisites

- Node.js **20.x** or **22.x** (`node --version`)
- npm 10+ (or pnpm if you prefer it; run `pnpm import` after `pnpm install`)
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

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase Project
  Settings -> API.
- `SUPABASE_SERVICE_ROLE_KEY` from the same page. Server-only. Never commit.
- `DATABASE_URL` from Supabase Project Settings -> Database -> Connection string. Use
  the **pooler** URL for Vercel. The direct URL works locally.
- `RESEND_API_KEY` from the Resend dashboard.
- `NEXT_PUBLIC_SITE_URL` set to `http://localhost:3000` in dev.

### 3. Enable PostGIS in Supabase

In the Supabase dashboard: **Database -> Extensions -> search "postgis" -> Enable**.
You can also run `CREATE EXTENSION IF NOT EXISTS postgis;` in the SQL editor.

The first migration also runs this, but enabling via the dashboard is faster.

### 4. Run database migrations

```bash
npm run db:push
```

This applies `drizzle/0000_initial_schema.sql` to your Supabase database.

> If you change `lib/db/schema.ts`, regenerate the migration with
> `npm run db:generate` and re-run `npm run db:push`.

### 5. Configure Supabase Auth

- **Authentication -> URL Configuration:**
  - Site URL: `http://localhost:3000`
  - Redirect URLs: `http://localhost:3000/auth/callback`, plus your Vercel preview and
    prod URLs.
- **Authentication -> Email Templates:** customize as you like. The confirmation link
  needs to keep the default `?code=...` parameter.

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
3. Add every variable from `.env.example` to Vercel's **Environment Variables**
   (Production and Preview).
4. Use the Supabase **pooler** connection string for `DATABASE_URL` on Vercel (port
   6543, not 5432). Vercel's serverless functions need PgBouncer-style pooling.
5. Add your Vercel production URL and preview URL pattern to Supabase
   **Authentication -> URL Configuration -> Redirect URLs**.
6. Every push to `main` deploys to production. Every PR gets a preview deploy with the
   same env vars, which is great for async collaboration.

### Domain

Once we lock the domain, update:

- `NEXT_PUBLIC_SITE_URL` in Vercel env vars
- `metadataBase` in [`app/layout.tsx`](app/layout.tsx)
- Supabase redirect URLs

Candidate domains: `stoopapp.com`, `stoop.so`, `getstoop.com`, `hellostoop.com`. TBD,
founder decision.

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
│   └── ui/                           shadcn-style primitives (Button, Input, etc.)
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
├── tailwind.config.ts                Empty. All theming lives in app/globals.css.
├── tsconfig.json
└── package.json
```

## Roadmap

| Version | Theme | Highlights |
| --- | --- | --- |
| **v0.1** (this scaffold) | Marketing + signup + post-a-job skeleton | Landing, waitlist, auth, dashboard, post and browse jobs, profile stub |
| **v0.2** | The actual marketplace | Bidding, in-app messaging, accept-bid flow, basic Stripe Connect escrow, neighborhood seeding |
| **v0.3** | Trust layer | Verified-pro program (license + insurance + identity), neighbor-trust review feature, distance-ranked review feed |
| **v0.4** | Pro business OS | Calendar, invoices, receipts, SMS reminders, tax-ready earnings export |
| **v1.0** | Public launch | One Brooklyn neighborhood fully live, marketing push, press, paid acquisition |

Full sequencing and milestones in [`docs/roadmap.md`](docs/roadmap.md).

## Open questions / decisions to make

These are not locked yet. File an issue or bring them up in person:

- Final domain choice
- Final take-rate model (12% all-on-pro vs. Airbnb-style 3% + 12% split)
- Verification vendor (Checkr for background checks? Self-service license lookup?)
- First marketing motion (door-to-door at one block vs. Instagram targeting vs. Columbia network)
- Sentry vs. Highlight vs. nothing for error tracking
- Whether to do native apps at v0.4 or push them to v1.5

## Team

The founders:

- **Oscar.** Building.
- **Radoslav Kolev.** Columbia CS.
- **Nick.** Columbia CS.

Email us at [hello@stoop.app](mailto:hello@stoop.app) (placeholder until DNS is real).

## License

MIT. See [LICENSE](LICENSE).

---

<sub>Built in Brooklyn, with care, for the people who actually live on the block.</sub>
