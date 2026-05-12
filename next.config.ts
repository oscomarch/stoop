import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't pick up unrelated lockfiles
  // higher up the tree (e.g. when this repo is cloned into a folder that
  // happens to share a parent with another project).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
