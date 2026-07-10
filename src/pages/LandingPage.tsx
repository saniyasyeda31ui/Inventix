import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import WhyInventix from "../components/landing/WhyInventix";
import Footer from "../components/landing/Footer";

import { motion } from "motion/react";
import { Box, Network, Layers, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FAFBFF] text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Global Ambient Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Massive Ambient Glows */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-pink-200/40 rounded-full blur-[150px] mix-blend-multiply opacity-60"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-200/40 rounded-full blur-[160px] mix-blend-multiply opacity-50"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -50, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[15%] w-[70vw] h-[70vw] bg-cyan-200/30 rounded-full blur-[180px] mix-blend-multiply opacity-60"
        />

        {/* Cinematic Translucent Bubbles (Global) */}
        <motion.div
          animate={{ y: [0, -100, 0], x: [0, 30, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] w-32 h-32 rounded-full bg-gradient-to-tr from-white/40 to-white/10 backdrop-blur-[12px] border border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(255,255,255,0.8)]"
        />
        <motion.div
          animate={{ y: [0, 80, 0], x: [0, -40, 0], rotate: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[60%] right-[12%] w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-100/30 to-white/10 backdrop-blur-[16px] border border-white/50 shadow-[0_20px_40px_rgba(99,102,241,0.05),inset_0_0_30px_rgba(255,255,255,0.9)]"
        />
        <motion.div
          animate={{ y: [0, -60, 0], x: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] left-[40%] w-16 h-16 rounded-full bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-md border border-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.05),inset_0_0_15px_rgba(255,255,255,1)]"
        />

        {/* Global Dotted Grid for scale & technical feel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#94a3b8_1px,_transparent_1px)] opacity-[0.12]" style={{ backgroundSize: '32px 32px' }} />
        
        {/* Ultra-subtle Grain Texture for organic luxury feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Primary Landing Page Core Sections */}
      <div className="relative z-10">
        <Navbar />
        {/* Each section now manages its own specific ambient blobs to ensure background evolution */}
        <Hero />
        <Features />
        <HowItWorks />
        <WhyInventix />
        <Footer />
      </div>
    </div>
  );
}