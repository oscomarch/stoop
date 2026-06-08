import { Reveal, Stagger, StaggerItem, Marquee } from "./motion";

const problems = [
  {
    quote:
      "I posted on Facebook Marketplace for a leaky sink. Six guys messaged me. Three didn't show. One asked for cash up front.",
    by: "Park Slope homeowner",
  },
  {
    quote:
      "Yelp wanted $2,400 a month for leads. Half of them were spam. I quit and went back to door hangers.",
    by: "Boerum Hill plumber",
  },
  {
    quote:
      "Angi sells the same job to four of us. We all call within 60 seconds. The homeowner gets buried and the lowest quote usually wins.",
    by: "Crown Heights electrician",
  },
];

const oldWay = [
  "Cash up front",
  "No-shows",
  "$2,400 a month for leads",
  "Race to the bottom",
  "Spam calls",
  "Fake reviews",
];

export function ProblemSection() {
  return (
    <section className="grain-overlay relative overflow-hidden bg-ink-900 py-24 text-cream-50">
      <div className="relative z-[2]">
        <Reveal className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-terracotta-400">
            The way it works now
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Right now, hiring help is a gamble.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-cream-200 text-pretty">
            Homeowners guess and hope. Pros pay for cold leads that ghost them.
            The apps in the middle make money from the mess.
          </p>
        </Reveal>

        <div className="mt-12">
          <Marquee slow>
            {oldWay.map((t) => (
              <span
                key={t}
                className="mx-3 rounded-full border border-cream-50/15 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-cream-300"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </div>

        <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 px-6 md:grid-cols-3">
          {problems.map((p) => (
            <StaggerItem key={p.by}>
              <figure className="h-full rounded-2xl border border-cream-50/10 bg-cream-50/5 p-6">
                <blockquote className="text-cream-100">
                  <p className="text-base leading-relaxed">&ldquo;{p.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-4 text-sm text-cream-300">{p.by}</figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
