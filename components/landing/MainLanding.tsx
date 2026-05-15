import { HeroSection } from "@/components/landing/main/HeroSection";
import { ThreeHighlights } from "@/components/landing/main/ThreeHighlights";
import { HowItWorksMain } from "@/components/landing/main/HowItWorksMain";
import { ScenariosSection } from "@/components/landing/main/ScenariosSection";
import { WhyWorthSection } from "@/components/landing/main/WhyWorthSection";
import { PricingTeaserSection } from "@/components/landing/main/PricingTeaserSection";
import { HomeFaqSection } from "@/components/landing/main/HomeFaqSection";

export function MainLanding() {
  return (
    <>
      <HeroSection />
      <ThreeHighlights />
      <HowItWorksMain />
      <ScenariosSection />
      <WhyWorthSection />
      <PricingTeaserSection />
      <HomeFaqSection />
    </>
  );
}
