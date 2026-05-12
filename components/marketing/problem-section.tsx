import { AlertTriangle } from "lucide-react";

const problems = [
  {
    quote:
      "I posted on Facebook Marketplace for a leaky sink. Six guys messaged me. Three didn't show. One showed up and asked for cash up front.",
    by: "Park Slope homeowner",
  },
  {
    quote:
      "Yelp wanted $2,400 a month for leads. Half of them were spam. I quit and went back to door hangers.",
    by: "Boerum Hill plumber",
  },
  {
    quote:
      "Angi sells the same job to four contractors. We all call within 60 seconds. The homeowner gets bombarded and the cheapest quote usually wins.",
    by: "Crown Heights electrician",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-ink-900 py-24 text-cream-50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 bg-cream-50/5 px-3 py-1 text-xs font-medium text-cream-100">
            <AlertTriangle className="h-3 w-3" />
            The current state of home services
          </div>
          <h2 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Trust is the part that&apos;s broken.
          </h2>
          <p className="mt-5 text-lg text-cream-200 text-pretty">
            Homeowners are gambling. Pros are paying 20% of their revenue for
            cold leads that ghost them. Everyone&apos;s losing, except the
            platforms that monetize the confusion.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <figure
              key={p.by}
              className="rounded-2xl border border-cream-50/10 bg-cream-50/5 p-6"
            >
              <blockquote className="text-cream-100">
                <p className="text-base leading-relaxed">&ldquo;{p.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-4 text-sm text-cream-300">{p.by}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
