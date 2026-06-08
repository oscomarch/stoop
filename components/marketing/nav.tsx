"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/for-tradespeople", label: "For pros" },
  { href: "/manifesto", label: "Manifesto" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile menu so only the sheet scrolls.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href !== "/#how" && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-4">
      <div
        className={cn(
          "relative mx-auto flex items-center justify-between transition-all duration-300 ease-out",
          scrolled
            ? "mt-2 h-14 max-w-5xl rounded-full border border-cream-200 bg-cream-50/80 pl-5 pr-2.5 shadow-[0_10px_34px_-16px_rgba(26,26,24,0.4)] backdrop-blur-md"
            : "mt-0 h-16 max-w-7xl rounded-full border border-transparent px-3"
        )}
      >
        <Link
          href="/"
          className="group flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Stoop home"
        >
          <Logo className="transition-transform duration-200 group-hover:-translate-y-px" />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative rounded-full px-3 py-2 font-ui text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-ink-900"
                  : "text-ink-600 hover:text-ink-900"
              )}
            >
              {link.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 bottom-1 h-[2px] origin-left rounded-full bg-terracotta-500 transition-transform duration-300 ease-out",
                  isActive(link.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="#waitlist">Join the waitlist</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-ink-900 bg-cream-50 text-ink-900 shadow-[0_3px_0_0_var(--color-ink-900)] transition-[transform,box-shadow] duration-150 active:translate-y-0.5 active:shadow-[0_1px_0_0_var(--color-ink-900)] md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <div
              className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <m.div
              className="absolute inset-x-3 top-3 origin-top rounded-3xl border border-cream-200 bg-cream-50 p-5 shadow-[0_30px_80px_-30px_rgba(26,26,24,0.6)]"
              initial={{ opacity: 0, y: reduce ? 0 : -16, scale: reduce ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : -12, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex size-10 items-center justify-center rounded-full border-2 border-ink-900 bg-cream-50 text-ink-900 shadow-[0_3px_0_0_var(--color-ink-900)] transition-[transform,box-shadow] duration-150 active:translate-y-0.5 active:shadow-[0_1px_0_0_var(--color-ink-900)]"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col">
                {LINKS.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between border-b border-cream-200 py-4 font-serif text-2xl font-medium tracking-tight transition-colors",
                      isActive(link.href)
                        ? "text-terracotta-700"
                        : "text-ink-900 hover:text-terracotta-700"
                    )}
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs text-ink-400">
                      0{i + 1}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="#waitlist" onClick={() => setOpen(false)}>
                    Join the waitlist
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                </Button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
