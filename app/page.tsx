import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { ProblemSection } from "@/components/marketing/problem-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { NeighborTrustSection } from "@/components/marketing/neighbor-trust-section";
import { TradesGrid } from "@/components/marketing/trades-grid";
import { TradespersonCta } from "@/components/marketing/tradesperson-cta";
import { WaitlistSection } from "@/components/marketing/waitlist-form";
import { MarketingFooter } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <NeighborTrustSection />
        <TradesGrid />
        <TradespersonCta />
        <WaitlistSection />
      </main>
      <MarketingFooter />
    </>
  );
}
