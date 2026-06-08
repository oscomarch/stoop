"use client";

import { LazyMotion, domAnimation } from "motion/react";

/**
 * Loads only the DOM animation feature set (animations, variants, exit and
 * gestures) instead of the full Framer Motion bundle. The site uses no layout
 * or drag animations, so this trims a large chunk of JS with no visual change.
 * Paired with the lightweight `m` components used across the app.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
