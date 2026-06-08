import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { ProblemSection } from "@/components/marketing/problem-section";
import { StoopChat } from "@/components/marketing/stoop-chat";
import { BlockWalk } from "@/components/marketing/block-walk";
import { BlindBids } from "@/components/marketing/blind-bids";
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
        <StoopChat />
        <BlockWalk />
        <BlindBids />
        <TradesGrid />
        <TradespersonCta />
        <WaitlistSection />
      </main>
      <MarketingFooter />
    </>
  );
}
