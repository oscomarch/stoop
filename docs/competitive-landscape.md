# Competitive landscape

There is no shortage of companies in this space. The question is not "is there
competition?" It's "why is there room for us in spite of it?" This doc lays out
each major player, what they're good at, and the specific structural reason
they're not the right home for the customer we serve.

## The matrix

| Company | Core motion | Why pros tolerate it | Why pros hate it |
| --- | --- | --- | --- |
| Thumbtack | Pay-per-lead | Easy onboarding | $40+ per lead, no escrow, low close rate |
| Angi (HomeAdvisor) | Pay-per-lead, sells the same lead to multiple pros | Marketing scale | Same lead sold 3 to 4 times, race-to-bottom auctions |
| TaskRabbit | Marketplace with 15% take + percentage to platform | Bookable like a hotel | No back-office, dominated by Apple and IKEA partnerships |
| Yelp / Yelp Ads | Discovery + paid placement | Local SEO | Reviews gamed, paid placement distorts ranking |
| Facebook Marketplace / Groups | Free social discovery | Free | No infra (payments, scheduling, recourse) |
| Nextdoor | Neighborhood social network | Free | No infra; ad model misaligned |
| Houzz | Inspiration + designer-led | Big project leads | Concentrated on premium remodels |
| Jobber / Housecall Pro | Back-office software (CRM, invoicing, scheduling) | Run their business | They don't bring customers |
| Angi Services / Handy | First-party home services with employees | Easy customer experience | Pros work as low-margin contractors |

## Why each leaves a window for Stoop

### Thumbtack

- **Strength.** Strong SEO, huge supply, mobile app polish.
- **The structural problem.** Their entire monetization model is selling cold
  leads to multiple pros at $20 to $80 each, regardless of conversion. This
  guarantees pro dissatisfaction (roughly 70% of leads convert to zero work).
  The classic "everyone has a Thumbtack story" of the contractor who quit
  after spending $1,500 in a month with one job to show for it.
- **Why we win.** We charge $0 to bid, and only take a fee when a job
  actually closes. We are the structurally opposite model.

### Angi (HomeAdvisor / Angie's List)

- **Strength.** Brand recognition from the merger.
- **The structural problem.** They sell the same homeowner's job to 3 or 4
  pros at once and race-to-the-bottom them. Customer experience is being
  bombarded with phone calls within 60 seconds of posting. Pro experience is
  "show up fast or lose."
- **Why we win.** Stoop jobs go to *all* qualified pros in the area but as
  bids, not phone calls. Homeowners review bids on their own time. The
  customer-pro interaction is asynchronous, and asynchronous is a feature.

### TaskRabbit

- **Strength.** Beloved for assembly and small tasks. Apple and IKEA
  partnerships.
- **The structural problem.** Optimized for micro-tasks ($60 IKEA assembly),
  not trade work. Doesn't capture license or insurance verification. Doesn't
  have the business-OS depth that a working plumber needs.
- **Why we win.** We start with licensed trade work first and add the
  back-office features (scheduling, invoicing) that real pros need to stay.

### Yelp

- **Strength.** The default "look up local business" verb on the internet.
- **The structural problem.** Reviews are gameable. Paid placement distorts
  ranking. Pros pay thousands a month for ads to outrank organic competitors.
  Yelp's customer is the advertiser, not the reviewer.
- **Why we win.** Reviews on Stoop are anchored to the reviewer's geographic
  position. The viewer sees what their *neighbors* said, not what a paid
  advertiser bought to the top. No advertising slots. Ranking is by trust
  signal alone.

### Facebook Marketplace and local Facebook Groups

- **Strength.** Genuinely social. People trust their neighbors there.
- **The structural problem.** Zero infrastructure. No payments. No
  verification. No recourse. Cash-only handshake deals.
- **Why we win.** We layer escrow, verification, and invoicing on top of the
  social proof Facebook already produces. We don't compete with neighbor recs.
  We *operationalize* them.

### Nextdoor

- **Strength.** Hyperlocal social network. Has the density we want.
- **The structural problem.** Advertising-supported. No transaction infra.
  Quality of feed degrades as platform scales.
- **Why we win.** Same as Facebook. They have the social signal, we have the
  rails.

### Houzz

- **Strength.** Premium remodels, design inspiration, contractor portfolios.
- **The structural problem.** Centered on full renovations and high-end pros,
  not small or medium maintenance jobs.
- **Why we win.** Different segment. We co-exist.

### Jobber / Housecall Pro

- **Strength.** Best-in-class business OS for trade pros. Pros love them.
- **The structural problem.** They don't bring customers. Pros still need
  leads from Thumbtack, Angi, or word of mouth.
- **Why we win.** We bring the customer *and* the back-office, in one tool,
  in one bill. Over time we converge on Jobber's depth while owning the
  demand side.

### Angi Services / Handy

- **Strength.** Bookable like ordering an Uber. Fixed prices, instant
  booking.
- **The structural problem.** Pros are essentially gig workers. Margins are
  squeezed. Quality varies because pros churn.
- **Why we win.** We don't try to replace the pro's autonomy. They run their
  own business, set their own prices, and we provide the infrastructure.

## What we are *not* trying to be

- A renovation marketplace (Houzz and Sweeten own that).
- A super-cheap micro-task layer (TaskRabbit owns that).
- A back-office-only tool (Jobber owns that).
- A first-party home services brand (Handy owns that).
- A general "local business" directory (Yelp owns that).

We are a **trust-first marketplace for small-to-medium home maintenance jobs**.
Narrow on purpose.

## The defensible moat (once we hit liquidity)

Reviews anchored to physical points compound geographically. A competitor who
launches in Park Slope after we've reached liquidity will face this problem:

- Their first homeowner posts a job.
- The homeowner looks at the bidding pros.
- For each pro, "reviews from your neighbors" returns 0 results.
- Meanwhile on Stoop, the same pro might have 12 reviews from the same 3-block
  radius.

A competitor can copy our feature, but they can't copy the reviewers' physical
locations. Trust graphs compound on themselves the way Facebook's friend graph
did. It's not a feature, it's an accumulation.

The narrow geographic launch is what makes this moat-buildable in the first
place.

## Risks

- **TaskRabbit (or another well-funded incumbent) decides to copy us in NYC.**
  Possible. Our defense: density, founder hustle, and a brand that is *about*
  trust rather than treating it as a feature.
- **Verification and insurance compliance is more expensive than we model.**
  Likely. Budget accordingly in v0.3. Don't compromise.
- **Pros find our review feed unfavorable and refuse to participate.** Real
  risk. Mitigation: clear rules, dispute path, and a fair "respond to a
  review" affordance that doesn't compromise reviewer signal.
- **Homeowners abuse free posting and create low-intent jobs.** Mitigation:
  require a budget range, require ID verification before posting more than 1
  job, throttle.
