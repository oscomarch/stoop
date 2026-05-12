import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cream-200 bg-cream-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="Stoop home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-700 md:flex">
          <Link href="/how-it-works" className="transition-colors hover:text-ink-900">
            How it works
          </Link>
          <Link href="/for-tradespeople" className="transition-colors hover:text-ink-900">
            For tradespeople
          </Link>
          <Link href="/manifesto" className="transition-colors hover:text-ink-900">
            Manifesto
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="#waitlist">Join the waitlist</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
