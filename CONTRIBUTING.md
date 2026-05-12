# Contributing to Stoop

Internal dev guide. If you're Radoslav, Nick, or anyone else with commit access,
this is where the setup, deploy, and gotchas live.

## Prerequisites

- Node.js **20.x** or **22.x** (`node --version`)
- npm 10+ (or pnpm if you prefer; run `pnpm import` after `pnpm install`)
- A Supabase project you have access to
- A Resend API key
- Optional: Mapbox token, PostHog key

## Local setup

```bash
git clone git@github.com:oscomarch/stoop.git
cd stoop
npm install
cp .env.example .env.local
```

Then open `.env.local` and fill in the five required values:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
DATABASE_URL="postgresql://postgres.YOUR_PROJECT:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
RESEND_API_KEY="re_..."
```

For local dev `DATABASE_URL` can be the Session pooler (port 5432) or the
direct connection. **Don't** use the Transaction pooler (port 6543) for local
work, drizzle-kit migrations break with it.

If your DB password has special characters (`@ # & : / ? = % +`), either
URL-encode them or reset the password to alphanumeric in
**Supabase -> Project Settings -> Database -> Reset database password**.

## Database setup

The Drizzle `db:push` command currently chokes on the PostGIS `geography` type
during introspection. Until that's fixed upstream, run the migration manually
the first time:

1. **Supabase -> Database -> Extensions**: enable `postgis` and `uuid-ossp`.
2. **Supabase -> SQL Editor -> New query**, paste the contents of
   `drizzle/0000_initial_schema.sql`, and run.
3. Verify in **Table Editor** that all seven tables exist:
   `bids`, `homeowner_profiles`, `jobs`, `reviews`, `tradesperson_profiles`,
   `users`, `waitlist`.

When you add or change schema later:

```bash
npm run db:generate
sed -i '' 's/"geography(Point, 4326)"/geography(Point, 4326)/g' drizzle/*.sql
```

Then paste the new migration into the Supabase SQL Editor.

## Supabase Auth

In Supabase, **Authentication -> URL Configuration**:

- Site URL: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://<your-vercel-prod-domain>/auth/callback`
  - `https://*-oscomarch.vercel.app/auth/callback` (preview deploys)

## Run the app

```bash
npm run dev
```

Open [`http://localhost:3000`](http://localhost:3000).

## Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript without emitting |
| `npm run db:generate` | Regenerate Drizzle migrations after schema changes |
| `npm run db:push` | Apply schema changes via drizzle-kit (broken with PostGIS, see above) |
| `npm run db:studio` | Open Drizzle Studio (db browser) |

## Deploying

We deploy on Vercel + Supabase. Every push to `main` deploys to production.
Every PR gets a preview deploy with the same env vars.

### First-time Vercel setup

1. Push the repo to GitHub (already done).
2. In Vercel, **Import** `oscomarch/stoop`. Framework auto-detects as Next.js.
3. Before clicking Deploy, expand **Environment Variables** and add every
   variable from `.env.example`. Check all three environments
   (Production, Preview, Development).
4. **DATABASE_URL on Vercel must be the Transaction pooler URL (port 6543).**
   Different from local. Vercel's serverless functions need PgBouncer-style
   connection pooling.
5. Click Deploy.
6. Once you have your Vercel URL, set `NEXT_PUBLIC_SITE_URL` to it and add
   the URL to Supabase Auth redirect URLs (see above).

### Common deploy gotchas

- **`Missing required environment variable: DATABASE_URL`**: you added the env
  var after the last deploy. Redeploy.
- **`password authentication failed for user "postgres"`**: your `DATABASE_URL`
  is the direct connection URL (`postgres@db.xxx.supabase.co:5432`) instead of
  the pooler URL (`postgres.PROJECT@aws-x-us-east-1.pooler.supabase.com:6543`).
- **`password authentication failed`** with the right user format: the password
  in the URL has unescaped special chars. URL-encode them or reset the
  password.
- **Square brackets `[...]` literally in the URL**: Supabase displays
  `[YOUR-PASSWORD]` as a placeholder. The brackets aren't supposed to be in
  the actual URL.

### Domain

When we lock a domain, update:

- `NEXT_PUBLIC_SITE_URL` in Vercel env vars
- `metadataBase` in `app/layout.tsx`
- Supabase Auth redirect URLs

## Repo structure

```
.
├── app/
│   ├── (marketing)/                  Public marketing pages
│   ├── (auth)/                       Sign-in / sign-up flows
│   ├── (app)/                        Authed product surface
│   ├── api/                          API routes (waitlist, etc.)
│   ├── auth/callback/                Supabase email confirmation handler
│   ├── icon.tsx                      Favicon (dynamic)
│   ├── opengraph-image.tsx           OG image (dynamic)
│   ├── globals.css                   Tailwind v4 + brand tokens
│   └── layout.tsx                    Root layout (fonts, PostHog)
├── components/
│   ├── analytics/                    PostHog provider
│   ├── app/                          Authed UI (AppNav, JobCard)
│   ├── brand/                        Logo
│   ├── marketing/                    Landing-page sections
│   └── ui/                           shadcn-style primitives
├── drizzle/                          SQL migrations + meta
├── lib/
│   ├── auth.ts                       requireUser / requireRole helpers
│   ├── constants.ts                  Trades, neighborhoods, brand
│   ├── db/                           Drizzle schema + client
│   ├── email.ts                      Resend email rendering
│   ├── env.ts                        Centralized env var access
│   └── supabase/                     Browser / server / proxy clients
├── docs/                             Strategy docs
├── proxy.ts                          Next.js 16 proxy (was middleware)
└── drizzle.config.ts
```

## Conventions

- TypeScript everywhere. No `any` unless you have a really good reason.
- Server Components by default. Add `"use client"` only when needed.
- Server Actions for mutations. API routes only for webhooks and the waitlist.
- Tailwind v4 with the brand tokens in `app/globals.css`. Don't introduce
  inline colors that aren't on the palette.
- No em dashes in user-facing copy. Voice should sound like a human living in
  Brooklyn, not a pitch deck.

## When you're stuck

- Read `node_modules/next/dist/docs/` before assuming Next.js works the way
  you remember. This is Next.js 16, lots of breaking changes from 15 and 14.
- For Drizzle: their docs at [orm.drizzle.team](https://orm.drizzle.team) are
  good. The `postgres-js` driver docs cover most gotchas with Supabase.
- For Supabase Auth in App Router: the `@supabase/ssr` package docs.
