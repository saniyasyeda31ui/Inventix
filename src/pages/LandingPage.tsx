import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import TrustedBy from "../components/landing/TrustedBy";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import WhyInventix from "../components/landing/WhyInventix";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">
      {/* Background radial spotlights */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-indigo-950/15 via-transparent to-transparent pointer-events-none" />

      {/* Primary Landing Page Core Sections */}
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <WhyInventix />
      <FAQ />
      <Footer />
    </div>
  );
}
