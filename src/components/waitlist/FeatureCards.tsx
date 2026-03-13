"use client";

import React from "react";
import { MapPin, Zap, Navigation } from "lucide-react";

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both font-sans mt-12">
      {/* Feature 1 - MapPin */}
      <div className="group relative p-8 sm:p-10 rounded-[32px] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] supports-[backdrop-filter]:bg-white/[0.01]">
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute -right-6 -top-10 text-[140px] font-black text-white/[0.015] select-none pointer-events-none group-hover:text-white/[0.03] transition-colors duration-500 leading-none tracking-tighter">
          01
        </div>
        <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/[0.05] group-hover:ring-white/[0.1] transition-all duration-500" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-b from-white/[0.08] to-white/[0.01] border border-white/[0.08] shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:border-white/20">
            <MapPin className="h-7 w-7 text-white/70 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
          </div>
          <h3 className="mb-3.5 text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            Curated Drop Zones
          </h3>
          <p className="text-base font-medium leading-relaxed text-[#8a8a8a] group-hover:text-white/80 transition-colors duration-500">
            Meetups happen strictly at verified, public hotspots. Safety is built into the coordinates. Zero sketchy residential addresses.
          </p>
        </div>
      </div>

      {/* Feature 2 - Zap (Gold) */}
      <div className="group relative p-8 sm:p-10 rounded-[32px] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(239,200,139,0.15)] supports-[backdrop-filter]:bg-white/[0.01]">
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute -right-6 -top-10 text-[140px] font-black text-[#EFC88B]/[0.015] select-none pointer-events-none group-hover:text-[#EFC88B]/[0.04] transition-colors duration-500 leading-none tracking-tighter">
          02
        </div>
        <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/[0.05] group-hover:ring-[#EFC88B]/20 transition-all duration-500" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EFC88B]/40 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[#EFC88B]/10 to-transparent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#EFC88B]/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-b from-[#EFC88B]/[0.08] to-[#EFC88B]/[0.01] border border-white/[0.08] shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(239,200,139,0.2)] group-hover:border-[#EFC88B]/40">
            <Zap className="h-7 w-7 text-[#EFC88B]/70 group-hover:text-[#EFC88B] transition-colors duration-300 fill-[#EFC88B]/10" strokeWidth={1.5} />
          </div>
          <h3 className="mb-3.5 text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            Expiring Connections
          </h3>
          <p className="text-base font-medium leading-relaxed text-[#8a8a8a] group-hover:text-white/80 transition-colors duration-500">
            Matches unlock a temporary burner chat. Make the plan, meet up, and let the history self-destruct. Live in the moment.
          </p>
        </div>
      </div>

      {/* Feature 3 - Navigation (Orange) */}
      <div className="group relative p-8 sm:p-10 rounded-[32px] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(207,92,54,0.2)] supports-[backdrop-filter]:bg-white/[0.01]">
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute -right-6 -top-10 text-[140px] font-black text-[#CF5C36]/[0.015] select-none pointer-events-none group-hover:text-[#CF5C36]/[0.04] transition-colors duration-500 leading-none tracking-tighter">
          03
        </div>
        <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/[0.05] group-hover:ring-[#CF5C36]/30 transition-all duration-500" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#CF5C36]/60 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[#CF5C36]/20 to-transparent" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-[#CF5C36]/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-b from-[#CF5C36]/[0.1] to-[#CF5C36]/[0.01] border border-white/[0.08] shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(207,92,54,0.3)] group-hover:border-[#CF5C36]/50">
            <Navigation className="h-7 w-7 text-[#CF5C36]/70 group-hover:text-[#CF5C36] transition-colors duration-300 fill-[#CF5C36]/10" strokeWidth={1.5} />
          </div>
          <h3 className="mb-3.5 text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            Proximity Unlock
          </h3>
          <p className="text-base font-medium leading-relaxed text-[#8a8a8a] group-hover:text-white/80 transition-colors duration-500">
            Your exact location stays masked until you're both within a 500-meter radius of the venue. Ghosting solved by physics.
          </p>
        </div>
      </div>
    </div>
  );
}