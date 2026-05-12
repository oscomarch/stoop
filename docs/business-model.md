# Business model

> **Status:** working draft. The numbers below are *defaults the team should
> challenge*, not commitments. We'll re-litigate at the v0.2 milestone after we
> have real bid and acceptance data.

## Principles before numbers

Before we pick a take rate, we want to commit to these constraints:

1. **No cold-lead fees, ever.** Charging pros $40 to talk to someone who never
   responds is the model we're attacking. We will never do it ourselves.
2. **No subscriptions.** Monthly subscriptions trap pros into paying when
   business is slow. Stoop only makes money when work happens.
3. **No paid placement that distorts ranking.** Reviews and proximity rank the
   feed. We will never sell an upranking.
4. **No surprise fees on the homeowner side.** The price they accept is the
   price they pay. Platform fees, if any, are disclosed up front and never
   added at checkout.
5. **Tax simplicity for pros.** One number to remember. One year-end statement
   they can hand to an accountant.

These constraints kill several otherwise-attractive models (Yelp Ads, Thumbtack
pay-per-lead). Good. They're not who we want to be.

## The default model: 12% take rate on closed jobs, paid by the pro

| Lever | Default | Why |
| --- | --- | --- |
| Homeowner platform fee | 0% | We want to remove every barrier to posting. Friction kills demand. |
| Pro take | 12% of accepted bid | Reasonable margin for full-service infra (escrow + invoicing + scheduling + payment processing). |
| Subscription | $0 | See principles. |
| Pay-to-bid | $0 | See principles. |
| Repeat customer | 0% after 1st job | After matchmaking, we shouldn't tax relationships. |
| Payment processing | Included in 12% | Pros shouldn't have to do separate Stripe math. |
| Dispute fee | $0 (covered by reserve) | We hold about 2% of escrow flow as reserve. |

### Why 12% and not 20%

Thumbtack's economics, when you tally cold-lead spend and conversion rates,
typically work out to roughly 25 to 30% of actual bookings. TaskRabbit takes
15%+ in service fees. We could match either. We won't, because:

- **We want pros bragging about us.** A pro who pays 30% will tell other pros
  "this is the cost of doing business." A pro who pays 12% will tell other pros
  "you have to try this." The platform's distribution is its pros' word of
  mouth.
- **Margins improve with verticals, not with rake.** Once we have 10,000 pros,
  we can add ancillary revenue (insurance partnerships, tool financing, tax
  filing partnerships) at far better margins than another 5% of rake.
- **The pricing has to be obviously fair, not maximally extractive.** "12% only
  when you actually win" is a one-sentence pitch. "30% but here's the formula"
  is a memo.

### Why not split between homeowner and pro (Airbnb-style)

Airbnb's split exists because they have *price-sensitive guests* and
*cost-aware hosts*. Both sides care about the visible price. Home services are
different: homeowners care about *the total they pay*, pros care about *what
hits their bank account*. A 0/12 split surfaces a clean price to the homeowner
and a clean take to the pro. Easier to explain. Easier to trust.

We'll revisit this once we have data on conversion rates.

## Unit economics (worked example)

Hypothetical Park Slope job:

- Homeowner posts: leaking radiator. Budget $150 to $300.
- 4 pros bid. Homeowner accepts $220 from Marco.
- Homeowner funds escrow: $220. Stoop charges Marco 12%, which is **$26.40**.
- Marco arrives, fixes it, marks complete. Homeowner approves.
- Stoop releases $193.60 to Marco. Stoop nets $26.40. Stripe Connect fees
  (~2.9% + $0.30) come out of our cut, so we net roughly $19.40 per $220 job.
- Reserve allocation: about $5 set aside for chargeback / dispute coverage.

At 1,000 closed jobs per month at an average $250 ticket, gross revenue is
about $30,000 with roughly $22,000 net after payment processing and reserve.
That's our target liquidity for a fully-saturated single neighborhood.

## Why we still don't take homeowner fees

Even at full liquidity, the homeowner is the activation funnel. We will not put
a fee in front of "Post a job" until at least 12 months after launch, and
probably not even then. The cost of a free post is so low compared to the
lifetime value of an activated homeowner (multiple jobs per year, reviews that
produce signal, word of mouth in their building or block).

## Alternative models we considered

### Alternative A. Airbnb-style split (3% homeowner + 12% pro)

- **Pro:** maps to a model investors already understand.
- **Con:** Erodes the "free for homeowners" promise. Homeowner fees create
  abandonment at the highest-value step.
- **Verdict:** revisit after we have liquidity data.

### Alternative B. Flat $5 booking fee + 8% pro take

- **Pro:** more revenue per job at the same effective rake.
- **Con:** Adds a $5 line item the homeowner sees. We'd lose the "no
  surprises" story. Also makes $50 jobs uneconomical (a fence-post fix is
  unviable at $5/job + 8%).
- **Verdict:** no.

### Alternative C. Annual pro subscription ($500/year) + 5% take

- **Pro:** Predictable revenue. Mirrors Jobber's $500/year subscription model.
- **Con:** Pre-payment is the #1 reason new pros churn off Thumbtack. We'd be
  copying the worst part of competitors.
- **Verdict:** no.

### Alternative D. Free for everyone, monetize via insurance + tool financing partnerships

- **Pro:** maximally pro-friendly, viral.
- **Con:** Long, uncertain monetization path. Most platforms that promise this
  pivot to take rates within 2 years.
- **Verdict:** keep in back pocket. Not the v0.1, v0.2, or v0.3 plan.

## Where the money goes

For every $100 of platform revenue at scale, projected:

- about 25% engineering (us)
- about 30% verification and trust ops (background checks, license-validation
  tools, manual onboarding calls)
- about 15% payment processing and reserve
- about 10% marketing (early years much higher, later much lower)
- about 5% legal, compliance, and insurance
- about 15% margin / runway

This is illustrative, not budgeted. Real budgets come after the first 100
booked jobs.

## Things we will not do for revenue

- Sell jobs to multiple pros. (We will not. Ever.)
- Sell email lists. (Obvious.)
- Sell paid placement that distorts review rank.
- Hide platform fees in opaque "service charges" on the homeowner side.
- Charge cancellation fees to either side without dispute review.

If any of these stop being a hard line, **the founders have failed**.

## Decisions to make

- Final take rate (12% vs. something else)
- Whether to grandfather a lower rate for the first 100 verified pros (we lean
  yes; they're the founding cohort and word of mouth from them is invaluable)
- Reserve % held for disputes
- Whether to do a free-trial or referral program for homeowners ("first job,
  $0 platform fee, but the pro still pays")
