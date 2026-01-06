import {
  LandingHeader,
  HeroSection,
  LogoCloud,
  FeaturesSection,
  PricingSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
  LandingFooter,
} from '@/components/landing';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />
      <main className="flex-grow">
        <HeroSection />
        <LogoCloud />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
