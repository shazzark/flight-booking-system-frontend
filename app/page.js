import { HeroSection } from "./_component/home/heroSection";
import { SearchPreview } from "./_component/home/searchPreview";
import { HowItWorks } from "./_component/home/how-it-works";
import { WhyChooseUs } from "./_component/home/why-choose-us";
import { PopularRoutes } from "./_component/home/popularRoutes";
import { CTASection } from "./_component/home/ctaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchPreview />
      <HowItWorks />
      <WhyChooseUs />
      <PopularRoutes />
      <CTASection />
    </>
  );
}
