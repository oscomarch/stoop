"use client";

import * as React from "react";
import type { PostHog } from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";

import { env } from "@/lib/env";

// posthog-js is ~50kb and never paints anything, so we keep it out of the
// initial bundle: load it with a dynamic import once the browser is idle.
let instance: PostHog | null = null;
let loadStarted = false;

function capturePageview(url: string) {
  instance?.capture("$pageview", { $current_url: url });
}

function loadAnalytics() {
  if (loadStarted) return;
  const key = env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  loadStarted = true;
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
    instance = posthog;
    // Record the entry pageview now that the library is ready.
    capturePageview(window.location.pathname + window.location.search);
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const win = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const schedule =
      win.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const id = schedule(loadAnalytics);
    return () => {
      win.cancelIdleCallback?.(id as number);
    };
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
  const firstRun = React.useRef(true);

  React.useEffect(() => {
    // The entry pageview is fired by loadAnalytics once PostHog is ready, so
    // here we only handle subsequent client-side navigations.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!instance || !pathname) return;
    const qs = searchParams?.toString();
    capturePageview(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
