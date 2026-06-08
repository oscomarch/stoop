import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";

import { PostHogProvider } from "@/components/analytics/posthog-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stoop.app"),
  title: {
    default: "Stoop · Ask your stoop.",
    template: "%s · Stoop",
  },
  description:
    "The neighborhood marketplace for home services. Post a job, get sealed bids from vetted local pros, then read reviews from your real neighbors. Starting in Brooklyn.",
  keywords: [
    "home services",
    "handyman",
    "plumber",
    "electrician",
    "painter",
    "Brooklyn",
    "neighborhood marketplace",
    "escrow payments",
  ],
  openGraph: {
    title: "Stoop · Ask your stoop.",
    description:
      "The neighborhood marketplace for home services. Built for Brooklyn brownstones.",
    url: "https://stoop.app",
    siteName: "Stoop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stoop · Ask your stoop.",
    description:
      "The neighborhood marketplace for home services. Built for Brooklyn brownstones.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Suspense fallback={null}>
          <PostHogProvider>{children}</PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
