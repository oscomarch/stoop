import Link from "next/link";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/db/schema";
import { signOut } from "@/app/(auth)/actions";

export function AppNav({ user }: { user: User }) {
  const homeownerLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/jobs/new", label: "Post a job" },
    { href: "/profile", label: "Profile" },
  ];

  const contractorLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/jobs", label: "Browse jobs" },
    { href: "/profile", label: "Profile" },
  ];

  const links = user.role === "contractor" ? contractorLinks : homeownerLinks;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-cream-200 bg-cream-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" aria-label="Stoop home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-700 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink-900">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={user.role === "contractor" ? "moss" : "default"}>
            {user.role === "contractor" ? "Pro" : "Homeowner"}
          </Badge>
          <span className="hidden text-sm text-ink-600 sm:inline">
            {user.name ?? user.email}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
