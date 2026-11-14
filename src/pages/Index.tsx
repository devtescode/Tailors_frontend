import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";

function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.replace("#", ""));
    if (!target) return;

    const timer = window.setTimeout(
      () => target.scrollIntoView({ behavior: "smooth", block: "start" }),
      40,
    );

    return () => window.clearTimeout(timer);
  }, [hash]);
}

export default function Index() {
  useScrollToHash();

  return (
    <div className="min-h-screen bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-burgundy focus:px-6 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.18em] focus:text-cream"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <HeroSection />
        <ProductSection />
        <WhyChooseUs />
        <HowItWorks />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
