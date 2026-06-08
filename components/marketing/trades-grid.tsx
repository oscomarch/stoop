import { TRADES } from "@/lib/constants";
import { Reveal, Stagger, StaggerItem } from "./motion";

export function TradesGrid() {
  return (
    <section className="bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-terracotta-700">
            What we cover at launch
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 text-balance md:text-5xl">
            Five trades to start.
          </h2>
          <p className="mt-5 text-lg text-ink-600 text-pretty">
            About 80% of what a home actually needs. We add more once each one
            has enough pros nearby.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {TRADES.map((trade) => (
            <StaggerItem key={trade.id} className="h-full">
              <article className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta-300 hover:shadow-stoop">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110" aria-hidden>
                  {trade.emoji}
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight text-ink-900">
                  {trade.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{trade.description}</p>
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
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
