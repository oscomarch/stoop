"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-cream-200 bg-cream-50/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="Stoop home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-700 md:flex">
          <Link href="/#how" className="transition-colors hover:text-ink-900">
            How it works
          </Link>
          <Link href="/for-tradespeople" className="transition-colors hover:text-ink-900">
            For pros
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
