import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesGrid from "@/components/sections/ServicesGrid";
import KeyFeatures from "@/components/sections/KeyFeatures";
import HowItWorks from "@/components/sections/HowItWorks";
import PricingSection from "@/components/sections/PricingSection";
import Testimonials from "@/components/sections/Testimonials";
import TrustedBy from "@/components/sections/TrustedBy";
import FAQSection from "@/components/sections/FAQSection";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesGrid />
      <KeyFeatures />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <TrustedBy />
      <FAQSection />
      <CTABanner />
      <Footer />
    </main>
  );
}
