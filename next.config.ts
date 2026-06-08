import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't pick up unrelated lockfiles
  // higher up the tree (e.g. when this repo is cloned into a folder that
  // happens to share a parent with another project).
  turbopack: {
    root: path.resolve(__dirname),
  },
  // `framer-motion` ships in Next's default optimize list, but this app uses
  // the newer `motion` package, so opt it in explicitly to keep barrel imports
  // (hooks, AnimatePresence) from pulling more than they use.
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
