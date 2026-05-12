import { TRADES } from "@/lib/constants";

export function TradesGrid() {
  return (
    <section className="bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-700">
            What we cover at launch
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 text-balance md:text-5xl">
            Five trades. Eighty percent of what your home needs.
          </h2>
          <p className="mt-5 text-lg text-ink-600 text-pretty">
            We&apos;re starting focused. More trades will roll out as we hit density in each.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {TRADES.map((trade) => (
            <article
              key={trade.id}
              className="group flex flex-col rounded-2xl border border-ink-200 bg-cream-50 p-6 transition-all hover:border-terracotta-300 hover:shadow-md"
            >
              <span
                className="text-3xl"
                aria-hidden
              >
                {trade.emoji}
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight text-ink-900">
                {trade.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {trade.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {trade.examples.map((ex) => (
                  <li
                    key={ex}
                    className="rounded-full border border-cream-200 bg-cream-100 px-2 py-0.5 text-[11px] font-medium text-ink-600"
                  >
                    {ex}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
