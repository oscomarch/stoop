import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const neighborReviews = [
  {
    name: "Sarah K.",
    address: "Garfield Pl",
    distance: "2 doors down",
    stars: 5,
    quote: "Marco fixed our radiator on a Sunday. Honest, fast, clean. We have his number on the fridge now.",
    pro: "Marco — Plumbing",
  },
  {
    name: "Devon R.",
    address: "Carroll St",
    distance: "1 block",
    stars: 5,
    quote: "Patched a ceiling leak we'd been ignoring for a year. Showed me what he was doing the whole time.",
    pro: "Marco — Plumbing",
  },
  {
    name: "Aliyah J.",
    address: "President St",
    distance: "3 blocks",
    stars: 4,
    quote: "Re-did our bathroom fixtures. Solid work, came back to fix a small wobble without charging.",
    pro: "Marco — Plumbing",
  },
];

export function NeighborTrustSection() {
  return (
    <section className="relative bg-cream-100 py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-700">
            The neighbor-trust layer
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 text-balance md:text-5xl">
            A review from{" "}
            <span className="italic">two doors down</span> hits different.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-600 text-pretty">
            Every Stoop review is anchored to the reviewer&apos;s street. When you
            look up a plumber, we show you what people on{" "}
            <em>your block</em> actually said — ranked by how close they live.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-600 text-pretty">
            That&apos;s the moat. Yelp shows you a random star average. Google shows you
            paid placements. Stoop shows you the truth your neighbors already know.
          </p>

          <ul className="mt-8 space-y-3 text-base text-ink-700">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-600" />
              Reviews ranked by physical distance from you
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-600" />
              Verified pros only — license + insurance checked
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-600" />
              Escrow payments so the money is safe until the work&apos;s done
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-ink-200 bg-cream-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                  Reviews near you
                </p>
                <h3 className="font-serif text-2xl font-semibold text-ink-900">
                  Marco&apos;s Plumbing
                </h3>
              </div>
              <Badge variant="moss">Verified pro</Badge>
            </div>

            <div className="mt-6 divide-y divide-ink-200">
              {neighborReviews.map((r) => (
                <div key={r.name + r.address} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{r.name}</p>
                      <p className="text-xs text-ink-500">
                        {r.address} · {r.distance}
                      </p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < r.stars
                              ? "h-4 w-4 fill-terracotta-500 text-terracotta-500"
                              : "h-4 w-4 text-ink-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-ink-500">
              Sample reviews. Real launch coming soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
