<div align="center">

# Stoop

**Ask your stoop.**

The neighborhood marketplace for home services. Brooklyn brownstones first, then everywhere else.

</div>

---

> If you needed a babysitter, you'd ask the family two doors down before you'd open Yelp.
> Hiring a plumber should work the same way. Right now it doesn't. Homeowners gamble on
> Facebook Marketplace and sketchy referrals. Plumbers pay $40 a pop for cold leads that
> ghost them. Everyone loses except the platforms that monetize the confusion.
>
> Stoop is our shot at fixing that.

This repo is the working surface for the three of us. Read it like a thinking
doc, not a pitch deck. It explains what we're building, why, where we're
starting, and what's still open.

## Contents

- [What Stoop is](#what-stoop-is)
- [The name](#the-name)
- [The wedge](#the-wedge)
- [Why Brooklyn brownstones](#why-brooklyn-brownstones)
- [The neighbor-trust review feed](#the-neighbor-trust-review-feed)
- [Business model](#business-model)
- [Competitive landscape](#competitive-landscape)
- [What we're not trying to be](#what-were-not-trying-to-be)
- [Roadmap](#roadmap)
- [Open questions](#open-questions)
- [Team](#team)

## What Stoop is

Two pieces, one product:

1. **A marketplace.** Homeowners post jobs (handyman, plumbing, electrical,
   painting, appliance repair). Vetted pros nearby send bids. The homeowner
   picks one. Money sits in escrow until the job is done.
2. **A trust graph.** Every review is tied to the reviewer's street. When you
   look up a pro, you see what your *actual* neighbors said, ranked by physical
   distance. Over time that becomes a local trust graph other platforms can't
   fake.

The marketplace is the wedge. The trust graph is the moat.

## The name

**Stoop.** The thing in front of every Brooklyn brownstone. Where people sit,
talk, and trade the recommendations that already make this neighborhood work.
We're not building a new behavior, we're giving the existing one a phone-shaped
surface.

We considered "Block" first. Cool name, but Block Inc. (Jack Dorsey's company)
owns the trademark. Stoop is better anyway. It's smaller, more specific, and
the brownstone reference matters here.

Domain still TBD. Candidates: `stoopapp.com`, `stoop.so`, `getstoop.com`,
`hellostoop.com`. Decide before we put up paid ads.

## The wedge

We're keeping the launch surface tiny on purpose:

- **One geography.** Brooklyn brownstone neighborhoods (Park Slope, Cobble
  Hill, Carroll Gardens, Boerum Hill, Fort Greene, Clinton Hill, Bed-Stuy,
  Crown Heights, Prospect Heights, and the blocks next to them).
- **Five trades.** Handyman, plumbing, electrical, painting, appliance repair.
  Covers about 80% of what a brownstone actually needs done.
- **One product surface to start.** Web (mobile-friendly). Native apps come
  later if the data says we need them.

Everyone we talk to wants us to launch in more places, faster. Resist that.
The neighbor-trust idea only works if there's real density of reviews on a
single block. Density is what we're paying for in this first year. TAM
expansion comes after.

## Why Brooklyn brownstones

A trust-based marketplace needs *homeowner* density. Not population. Owners
who'll still be on the same block in two years and care about their roof and
their neighbor's roof.

Brooklyn brownstone neighborhoods are the densest pocket of homeowners we can
reach by F train. They're also a real community: people talk on the stoop,
parents text each other about contractors, block associations argue about
garbage cans on group chats. The informal trust network is already there. We
just need to give it a product surface.

Specifics that matter:

- Owner-occupancy in row-house neighborhoods runs 40 to 60%, compared to about
  25% Manhattan-wide.
- The blocks are walkable, so we can recruit early pros and homeowners in
  person.
- People here identify with their block, not just "Brooklyn." You're on
  Garfield Pl between 7th and 8th. That granularity is what the review feed
  is designed for.
- Two of three founders are at Columbia, one stop away on the F.

Full beachhead justification with the criteria matrix and the rejected
alternatives (Manhattan, Queens, the suburbs, Chicago) lives in
[`docs/why-brooklyn.md`](docs/why-brooklyn.md).

## The neighbor-trust review feed

Every review on Stoop captures the reviewer's geographic point at the time of
the review (`reviews.reviewer_location`, PostGIS `geography(Point, 4326)`).

When you view a pro, the query is roughly this:

```sql
SELECT r.*, ST_Distance(r.reviewer_location, $viewer_location) AS distance_m
FROM reviews r
WHERE r.subject_user_id = $pro_id
ORDER BY distance_m ASC NULLS LAST
LIMIT 10;
```

That returns a review feed that **shows you what your closest neighbors said
first.** "Sarah from 2 doors down on Garfield Pl" hits harder than "Sarah from
4 miles away."

Once we hit density in even one neighborhood, the moat compounds. Any copycat
has to recruit reviewers from the same blocks we already saturated, which
takes years. This is the part of the product that's not just "a Yelp clone
with better UX." It's a different artifact entirely.

## Business model

Short version: **escrow + take rate**, no cold-lead fees.

| Lever                     | Default                                       | Notes                                                              |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| Homeowner fee             | **0%** at launch                              | Reconsider once supply density is real.                            |
| Pro fee per job           | **12%** of accepted bid                       | Charged only on jobs the platform helped them win.                 |
| Subscription              | **$0**                                        | No monthly fees, ever. The 12% is the only number to remember.     |
| Listing and bidding       | **Free**                                      | Unlimited bids, unlike Thumbtack and Angi pay-per-lead.            |
| Payment processing        | **Included**                                  | Card and ACH fees baked into the 12%.                              |
| Repeat-customer discount  | **0% after first job with the same customer** | We get paid for matchmaking, not for taxing relationships.         |

Provisional. Founders can change it before launch. Unit economics, sensitivity
analysis, and the alternative splits we considered (Airbnb-style 3% + 12%,
flat booking fee + lower take, subscription + lower take) live in
[`docs/business-model.md`](docs/business-model.md).

The hard lines are in there too: no selling jobs to multiple pros, no paid
review placement, no surprise fees on the homeowner side. If we ever drift
from those, we've failed.

## Competitive landscape

Why the incumbents leave a window for us:

- **Thumbtack and Angi.** Pay-per-cold-lead model. Pros hate it. Quality is a
  race to the bottom. No escrow.
- **TaskRabbit.** Strong on micro-tasks (assembly, moving). Weak on licensed
  trades and long-term pro retention. Doesn't even try to be a business OS.
- **Yelp and Google Maps.** Discovery without trust. Reviews are gameable,
  paid placements distort rankings.
- **Facebook Marketplace and Nextdoor.** Real social proof, zero
  infrastructure (no payments, no scheduling, no recourse).
- **Houzz.** Design-led, premium remodels. Different segment, we co-exist.
- **Jobber and Housecall Pro.** Beloved by pros for back-office tooling, but
  they don't bring customers. Pros still need leads from somewhere.

The honest version: the incumbents are bigger, older, and better-funded. What
they don't have is *focus on this segment*. We do. That's the whole opening.

Detailed teardown of each in
[`docs/competitive-landscape.md`](docs/competitive-landscape.md), including
the risks section (what happens if TaskRabbit copies us, what happens if pros
refuse the review feed, etc.).

## What we're not trying to be

- A renovation marketplace (Houzz and Sweeten own that).
- A super-cheap micro-task layer (TaskRabbit owns that).
- A back-office-only tool (Jobber owns that).
- A first-party home services brand with W2 employees (Handy owns that).
- A general "local business" directory (Yelp owns that).

We are a **trust-first marketplace for small-to-medium home maintenance jobs**.
Narrow on purpose. Saying this clearly is important because every investor
conversation will tempt us to widen the surface.

## Roadmap

The short version. Full sequencing with acceptance criteria for each milestone
is in [`docs/roadmap.md`](docs/roadmap.md).

| Version | Theme | Highlights |
| --- | --- | --- |
| **v0.1** (this scaffold, live) | Marketing + signup + post-a-job skeleton | Landing, waitlist, auth, dashboard, post and browse jobs, profile stub |
| **v0.2** | The actual marketplace | Bidding, in-app messaging, accept-bid flow, basic Stripe Connect escrow, neighborhood seeding |
| **v0.3** | Trust layer | Verified-pro program (license + insurance + identity), neighbor-trust review feature, distance-ranked review feed |
| **v0.4** | Pro business OS | Calendar, invoices, receipts, SMS reminders, tax-ready earnings export |
| **v1.0** | Public launch | One Brooklyn neighborhood fully liquid, marketing push, press, paid acquisition |

The decision rule for expanding to a new neighborhood: the current one must
hit liquidity first (25+ verified pros, 50+ active homeowners, 1+ job per
active homeowner per month, 3+ reviews per booked job). We do not open
neighborhood N+1 until N is liquid.

## Open questions

The decisions we still owe each other:

- Final domain choice.
- Final take-rate model (12% all-on-pro vs. Airbnb-style 3% + 12% split).
- Verification vendor (Checkr for background checks? Self-service license
  lookup? Manual at first?).
- First marketing motion (door-to-door at one block vs. Instagram targeting
  vs. Columbia network vs. press at launch).
- Native apps at v0.4 or push to v1.5.
- How public to be while we're pre-launch.

File these as GitHub issues as we go so we can have the argument once and
record what we decided.

## Team

The founders:

- **Oscar.** Building.
- **Radoslav Kolev.** Columbia CS.
- **Nick.** Columbia CS.

Email: [hello@stoop.app](mailto:hello@stoop.app) (placeholder until DNS is real).

## License

MIT. See [LICENSE](LICENSE).

---

If you're a future cofounder, employee, or investor poking around this repo:
welcome to the block. Don't break anything.
