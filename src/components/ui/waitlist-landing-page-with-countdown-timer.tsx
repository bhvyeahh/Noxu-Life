"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, MapPin, ShieldCheck, Clock, Home } from "lucide-react";
import { GlassEffect, GlassDock, GlassButton, GlassFilter } from "@/components/ui/liquid-glass";
import { joinWaitlist } from "@/actions/waitlist"; // 1. Imported the Server Action

export function WaitlistExperience() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 2. Added Loading and Error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  // 3. Wired up the actual submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await joinWaitlist(email);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Network error. Could not reach server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full text-foreground overflow-x-hidden selection:bg-[#CF5C36] selection:text-white">
      {/* Required SVG Filter for Glass Effect */}
      <GlassFilter />

      {/* Premium Animated Gradient Background (No heavy blobs) */}
      <div 
        className="fixed inset-0 z-0 bg-gradient-to-br from-[#1a1010] via-[#000000] to-[#2a1710] bg-[length:200%_200%] animate-bg-pan pointer-events-none"
      />
      
      {/* Matte Noise Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      {/* VisionOS Dock Navigation */}
      <GlassDock>
        <GlassButton className="w-12 h-12 p-0 rounded-full flex items-center justify-center border-none bg-transparent shadow-none hover:bg-white/10">
          <Home className="w-5 h-5" />
        </GlassButton>
        <div className="w-[1px] h-6 bg-white/20 mx-1" />
        <span className="px-4 text-sm font-medium tracking-wide">Public Venues</span>
        <span className="px-4 text-sm font-medium tracking-wide hidden sm:block">24h Chats</span>
        <span className="px-4 text-sm font-medium tracking-wide hidden sm:block">Zero Ghosting</span>
      </GlassDock>

      <div className="relative z-10 flex flex-col items-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-[20px] border border-white/20 bg-white/5 backdrop-blur-md text-xs font-medium text-[#EFC88B] shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFC88B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFC88B]"></span>
            </span>
            Beta launching in select cities
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
            Your friends are busy. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CF5C36] to-[#EFC88B]">The world isn't.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light">
            The anti-dating app. Post your activity, find a spontaneous companion, and meet at verified public venues. 
          </p>

          {/* Waitlist Input */}
          <div className="max-w-md mx-auto relative">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="relative flex items-center group">
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-16 pl-6 pr-44 rounded-[24px] bg-white/[0.08] border border-white/20 focus:border-[#CF5C36]/50 text-white placeholder:text-white/40 outline-none transition-all backdrop-blur-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)] focus:bg-white/[0.12] disabled:opacity-50"
                />
                <div className="absolute right-2 top-2 bottom-2">
                  <GlassButton 
                    type="submit" 
                    disabled={isLoading}
                    className="h-full px-6 bg-[#CF5C36]/80 hover:bg-[#CF5C36] text-white border-white/30 group-focus-within:scale-[1.02] disabled:opacity-50"
                  >
                    {isLoading ? "Joining..." : "Request Access"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </GlassButton>
                </div>
              </form>
            ) : (
              <GlassEffect className="h-16 flex items-center justify-center bg-green-500/10 border-green-500/30 text-green-400">
                <ShieldCheck className="w-5 h-5 mr-2" />
                You're on the list.
              </GlassEffect>
            )}
            
            {/* 4. Display Error if one occurs */}
            {error && <p className="absolute -bottom-8 left-0 right-0 text-red-500 text-sm text-center">{error}</p>}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          
          {/* Feature 1 */}
          <div className="group relative p-8 rounded-[24px] bg-[#0A0A0A] border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.05)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-[#111111] text-[#7C7C7C] transition-all duration-500 group-hover:scale-110 group-hover:text-white group-hover:border-white/20 group-hover:shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)]">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-[#EEE5E9] tracking-tight">Public Venues Only</h3>
              <p className="text-sm font-light leading-relaxed text-[#7C7C7C] group-hover:text-[#a1a1a1] transition-colors duration-500">
                Integrated with Google Places. Meetups are strictly locked to verified public locations. No residential addresses allowed.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative p-8 rounded-[24px] bg-[#0A0A0A] border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(239,200,139,0.05)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EFC88B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#EFC88B]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-[#111111] text-[#EFC88B] transition-all duration-500 group-hover:scale-110 group-hover:border-[#EFC88B]/30 group-hover:shadow-[inset_0_1px_4px_rgba(239,200,139,0.1)]">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-[#EEE5E9] tracking-tight">24-Hour Vibe Check</h3>
              <p className="text-sm font-light leading-relaxed text-[#7C7C7C] group-hover:text-[#a1a1a1] transition-colors duration-500">
                Matches open a temporary chat. 24 hours after the event time, the chat and connection self-destruct. No lingering history.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative p-8 rounded-[24px] bg-[#0A0A0A] border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(207,92,54,0.05)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#CF5C36]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#CF5C36]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-[#111111] text-[#CF5C36] transition-all duration-500 group-hover:scale-110 group-hover:border-[#CF5C36]/30 group-hover:shadow-[inset_0_1px_4px_rgba(207,92,54,0.1)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-[#EEE5E9] tracking-tight">The Ghost Stalker Fix</h3>
              <p className="text-sm font-light leading-relaxed text-[#7C7C7C] group-hover:text-[#a1a1a1] transition-colors duration-500">
                Your exact location is hidden. Proximity unlocking only shares live coordinates when both users are within 500 meters.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}