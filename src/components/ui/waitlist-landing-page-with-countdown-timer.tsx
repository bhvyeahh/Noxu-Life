"use client";

import React, { useState, useEffect } from "react";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { InteractiveGradientBackground } from "@/components/ui/interactive-gradient-background";

// Importing the new split components
import { NoxuLoader } from "@/components/waitlist/NoxuLoader";
import { BrandLogo } from "@/components/waitlist/BrandLogo";
import { HeroText } from "@/components/waitlist/HeroText";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { ProductHuntCard } from "@/components/waitlist/ProductHuntCard";
import FeatureCards from "@/components/waitlist/FeatureCards";

export function WaitlistExperience() {
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full text-foreground overflow-x-hidden selection:bg-[#CF5C36] selection:text-white bg-[#000000]">
      
      {/* GSAP Cinematic Loader */}
      {showLoader && <NoxuLoader onComplete={() => setShowLoader(false)} />}

      <GlassFilter />

      {/* Hero Section (Contains the gradient) */}
      <InteractiveGradientBackground dark={false} intensity={1}>
        {/* Matte Noise Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        <div className="relative z-10 flex flex-col items-center pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
          
          <BrandLogo />

          <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            <HeroText />
            <WaitlistForm />
          </div>

          <ProductHuntCard />
          
        </div>
      </InteractiveGradientBackground>

      {/* OUTSIDE THE GRADIENT: Full Width Features Page */}
      <div className="relative w-full z-20">
        <FeatureCards />
      </div>

    </main>
  );
}