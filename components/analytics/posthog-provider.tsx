"use client";

import * as React from "react";
import posthog from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";

import { env } from "@/lib/env";

let initialized = false;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (initialized) return;
    const key = env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
    initialized = true;
  }, []);

  return (
    <>
      <PageviewTracker />
      {children}
    </>
  );
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!initialized || !pathname) return;
    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
