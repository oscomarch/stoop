const steps = [
  {
    number: "01",
    title: "Post the job",
    body: "Snap a photo, describe what's broken, set a budget. Takes 60 seconds.",
  },
  {
    number: "02",
    title: "Get bids from your block",
    body: "Vetted pros nearby bid on your job. See their work, their license, their actual neighbors' reviews.",
  },
  {
    number: "03",
    title: "Pay through escrow",
    body: "Your money is held by Stoop until the work is done. No more cash up-front. No more surprise charges.",
  },
  {
    number: "04",
    title: "Leave a review your neighbors will see",
    body: "Your review is anchored to your block. When the people down the street look for a pro, your honest take is what they see first.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-700">
            How Stoop works
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 text-balance md:text-5xl">
            Four steps. Built around trust.
          </h2>
        </div>

        <ol className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="relative rounded-2xl border border-ink-200 bg-cream-50 p-6 transition-shadow hover:shadow-md"
            >
              <span
                className="font-serif text-5xl font-light leading-none text-terracotta-300"
                aria-hidden
              >
                {step.number}
              </span>
              <h3 className="mt-6 font-serif text-2xl font-semibold tracking-tight text-ink-900">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink-600">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
