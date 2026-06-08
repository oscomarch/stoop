import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-200 bg-ink-900 py-16 text-cream-100">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo className="text-cream-50" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-300">
            The neighborhood marketplace for home services. Made in Brooklyn,
            for the people who actually live on the block.
          </p>
        </div>

        <nav className="text-sm">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cream-300">
            Product
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/how-it-works" className="hover:text-cream-50">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/for-tradespeople" className="hover:text-cream-50">
                For tradespeople
              </Link>
            </li>
            <li>
              <Link href="/manifesto" className="hover:text-cream-50">
                Manifesto
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="text-sm">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cream-300">
            Company
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="mailto:hello@stoop.app" className="hover:text-cream-50">
                hello@stoop.app
              </a>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-cream-50">
                Join the waitlist
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start gap-2 border-t border-cream-50/10 px-6 pt-8 text-xs text-cream-400 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Stoop. Brooklyn, NY.</p>
        <p>Currently launching in Brooklyn brownstone neighborhoods.</p>
      </div>
    </footer>
  );
}
