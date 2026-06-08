import { Suspense } from "react";
import type { Metadata } from "next";
import { Familjen_Grotesk, Hanken_Grotesk, Geist_Mono } from "next/font/google";

import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

// Display + body: a Swedish grotesque with ink-trap notches for character.
const familjen = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

// Buttons + small UI labels: a calmer grotesque that reads clean at small sizes.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

// Numbers, prices, eyebrows, meta: a monospace so figures lock to one width.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html
      lang="en"
      className={`${familjen.variable} ${hanken.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Suspense fallback={null}>
          <PostHogProvider>
            <MotionProvider>{children}</MotionProvider>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
