"use client";

import React, { useState, useEffect } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  MapPin,
  Zap,
  Navigation,
  Home,
  ShieldCheck,
} from "lucide-react";
import {
  GlassEffect,
  GlassDock,
  GlassButton,
  GlassFilter,
} from "@/components/ui/liquid-glass";
import { InteractiveGradientBackground } from "@/components/ui/interactive-gradient-background";
import { joinWaitlist, getWaitlistCount } from "@/actions/waitlist";

// ==========================================
// THE NOXU CINEMATIC LOADER (GSAP)
// ==========================================
const NoxuLoader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);
  const xRef = React.useRef<HTMLSpanElement>(null);
  
  // Refs for the side letters to push them away
  const nRef = React.useRef<HTMLSpanElement>(null);
  const oRef = React.useRef<HTMLSpanElement>(null);
  const uRef = React.useRef<HTMLSpanElement>(null);
  const dotRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    // Lock scrolling while loader is active
    document.body.style.overflow = "hidden";

    // FIXED: Using gsap.context() prevents the double-render bug in React 18 Strict Mode
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto"; // Unlock scrolling
          onComplete();
        },
      });

      // 1. Fade in the whole NOXU word from the dark
      tl.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "expo.out" }
      )
      
      // 2. The Suspense Pause: X pulses with energy
      .to(xRef.current, { 
        textShadow: "0px 0px 40px rgba(207,92,54,0.8)", 
        duration: 0.5, 
        yoyo: true, 
        repeat: 1 
      }, "+=0.2")

      // 3. The Breakaway: N, O slide left. U, dot slide right, fading out
      .to([nRef.current, oRef.current], { x: -50, opacity: 0, duration: 0.8, ease: "power3.inOut" }, "split")
      .to([uRef.current, dotRef.current], { x: 50, opacity: 0, duration: 0.8, ease: "power3.inOut" }, "split")

      // 4. The Gateway: The X extends its arms, scaling massively until we fly through it
      .to(xRef.current, { 
        scale: 150, 
        opacity: 0, // Fades out right as it engulfs the screen
        duration: 1.2, 
        ease: "power4.inOut" 
      }, "split+=0.2")

      // 5. Fade out the black background container to reveal the loaded page
      .to(containerRef.current, { 
        opacity: 0, 
        duration: 0.6, 
        ease: "power2.out" 
      }, "-=0.6");
    }, containerRef);

    return () => {
      ctx.revert(); // <--- This is the magic bullet that stops the duplicate run
      document.body.style.overflow = "auto";
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#030303]"
    >
      <div 
        ref={textRef} 
        className="text-5xl sm:text-7xl font-black tracking-tighter text-white flex items-center select-none"
      >
        <span ref={nRef} className="inline-block">N</span>
        <span ref={oRef} className="inline-block">O</span>
        
        {/* The Core 'X' */}
        <span 
          ref={xRef} 
          className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-[#CF5C36] via-[#E36940] to-[#EFC88B] mx-[2px] inline-block origin-center transform-gpu will-change-transform"
        >
          X
          {/* Subtle built-in glow for the X */}
          <span className="absolute inset-0 bg-[#CF5C36] blur-[10px] opacity-50 mix-blend-screen -z-10"></span>
        </span>
        
        <span ref={uRef} className="inline-block">U</span>
        <span ref={dotRef} className="text-[#CF5C36] ml-[2px] inline-block">.</span>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export function WaitlistExperience() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Added Loader State
  const [showLoader, setShowLoader] = useState(true);

  // FIXED: Initialized to 0 instead of null so it is strictly forced to render on screen.
  const [waitlistCount, setWaitlistCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);

    // Securely fetch only the integer count on load
    const fetchCount = async () => {
      try {
        const count = await getWaitlistCount();
        if (typeof count === "number") {
          setWaitlistCount(count);
        }
      } catch (err) {
        console.error("Failed to fetch count");
      }
    };

    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await joinWaitlist(email);

      if (result.success) {
        setIsSubmitted(true);
        // Optimistically increment the counter when they join
        setWaitlistCount((prev) => prev + 1);
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
    <main className="relative min-h-screen w-full text-foreground overflow-x-hidden selection:bg-[#CF5C36] selection:text-white bg-[#030303]">
      
      {/* GSAP Cinematic Loader */}
      {showLoader && <NoxuLoader onComplete={() => setShowLoader(false)} />}

      <GlassFilter />

      <InteractiveGradientBackground dark={false} intensity={1}>
        {/* Matte Noise Overlay */}
        <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        <div className="relative z-10 flex flex-col items-center pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
          {/* Luminous Brand Logo */}
          <div className="flex justify-center mb-10 relative animate-in fade-in slide-in-from-top-8 duration-1000">
            {/* Ambient background glow for the logo */}
            <div className="absolute inset-0 bg-[#CF5C36]/20 blur-[50px] rounded-full w-32 h-32 mx-auto -top-6 pointer-events-none"></div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white relative z-10 flex items-center drop-shadow-md">
              NO
              <span className="relative inline-flex items-center justify-center mx-[2px]">
                {/* The core letter */}
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-[#CF5C36] via-[#E36940] to-[#EFC88B]">
                  X
                </span>
                {/* The intense blurry aura behind the X */}
                <span className="absolute inset-0 bg-[#CF5C36] blur-[14px] opacity-80 scale-150 rounded-full mix-blend-screen pointer-events-none"></span>
              </span>
              U<span className="text-[#CF5C36] ml-[2px]">.</span>
            </h2>
          </div>

          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-[#EFC88B] shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFC88B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFC88B]"></span>
              </span>
              Early Access. Highly Limited.
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-semibold tracking-tighter mb-8 leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
              Your friends are busy. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CF5C36] via-[#E36940] to-[#EFC88B]">
                The city isn't.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Drop a vibe. Find your crowd. Meet up instantly. The city is
              waiting—start living.
            </p>

            {/* Waitlist Input */}
            <div className="max-w-md mx-auto relative">
              {!isSubmitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="relative flex items-center group"
                >
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-14 sm:h-16 pl-5 sm:pl-6 pr-[100px] sm:pr-44 rounded-full bg-white/[0.08] border border-white/20 focus:border-[#CF5C36]/50 text-white placeholder:text-white/40 outline-none transition-all backdrop-blur-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)] focus:bg-white/[0.12] disabled:opacity-50 text-sm sm:text-base font-medium"
                  />
                  <div className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2">
                    <GlassButton
                      type="submit"
                      disabled={isLoading}
                      className="h-full px-4 sm:px-6 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 group-focus-within:scale-[1.02] disabled:opacity-50 text-sm sm:text-base font-bold flex items-center shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                      {isLoading ? (
                        "Joining..."
                      ) : (
                        <>
                          <span className="hidden sm:inline">Join</span>
                          <span className="sm:hidden">Join</span>
                          <ArrowRight className="w-4 h-4 ml-1.5 sm:ml-2" />
                        </>
                      )}
                    </GlassButton>
                  </div>
                </form>
              ) : (
                <div className="h-14 sm:h-16 w-full flex items-center justify-center bg-green-500/10 border border-green-500/30 text-green-400 rounded-full shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)] text-sm sm:text-base font-bold backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Your spot is secured.
                </div>
              )}

              {/* Error Message */}
              {error && (
                <p className="absolute -bottom-12 left-0 right-0 text-red-400 text-xs sm:text-sm font-medium text-center bg-red-500/10 py-1.5 px-4 rounded-full border border-red-500/20 w-max mx-auto backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300">
                  {error}
                </p>
              )}

              {/* FIXED: Removed the null check so this absolutely renders on screen */}
              {/* Ultra-Premium Glass Waitlist Counter */}
              {waitlistCount !== null && (
                <div className="absolute -bottom-20 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                  <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-[20px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-all duration-300 group">
                    {/* Pulsating Live Indicator */}
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFC88B] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFC88B] shadow-[0_0_8px_#EFC88B]"></span>
                      </span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#EFC88B]/80 group-hover:text-[#EFC88B] transition-colors">
                        Live
                      </span>
                    </div>

                    <div className="w-px h-4 bg-white/10" />

                    {/* Premium 3D Mesh Avatars */}
                    <div className="flex -space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#CF5C36] to-black border border-white/20 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#EFC88B] via-[#CF5C36] to-[#3a1a10] border border-white/20 shadow-lg relative overflow-hidden z-10">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/20 shadow-lg flex items-center justify-center backdrop-blur-md z-20 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                        <span className="text-[10px] font-bold text-white/80 z-10">
                          +
                        </span>
                      </div>
                    </div>

                    {/* Premium Typography */}
                    <div className="text-sm font-medium text-white/50 tracking-wide flex items-baseline gap-1.5">
                      Join
                      <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#EFC88B] via-[#E36940] to-[#CF5C36] font-bold text-lg tracking-normal drop-shadow-sm">
                        {waitlistCount.toLocaleString()}
                      </strong>
                      others
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- PASTE THIS RIGHT BELOW YOUR WAITLIST FORM CONTAINER --- */}
          
          {/* Product Hunt Embed - Dark Glass Theme */}
          <div className="mt-20 sm:mt-24 mb-4 mx-auto w-full max-w-[420px] p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,97,84,0.15)] duration-500 animate-in fade-in slide-in-from-bottom-8 delay-700">
            <div className="flex items-center gap-4 mb-5">
              <img 
                alt="Noxu | The Inner Circle" 
                src="https://ph-files.imgix.net/fa850207-8b83-4398-aece-b6e117992254.png?auto=format&fit=crop&w=80&h=80" 
                className="w-16 h-16 rounded-[14px] object-cover flex-shrink-0 border border-white/10 shadow-inner"
              />
              <div className="flex-1 min-w-0 text-left">
                <h3 className="m-0 text-lg font-bold text-white leading-tight truncate tracking-tight">
                  Noxu | The Inner Circle
                </h3>
                <p className="mt-1 text-sm font-medium text-white/50 leading-snug line-clamp-2">
                  Your friends are busy. The city isn't.
                </p>
              </div>
            </div>
            <a 
              href="https://www.producthunt.com/products/noxu-the-inner-circle?embed=true&utm_source=embed&utm_medium=post_embed" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex w-full justify-center items-center gap-2 px-4 py-3 bg-[#FF6154] hover:bg-[#FF6154]/90 text-white decoration-none rounded-[12px] text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,97,84,0.2)] hover:shadow-[0_0_25px_rgba(255,97,84,0.4)] group"
            >
              Check it out on Product Hunt 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
          
          {/* --- END OF PRODUCT HUNT EMBED --- */}

          {/* Hyper-Premium Liquid Glass Feature Cards with Editorial Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both font-sans mt-12">
            {/* Feature 1 - MapPin */}
            <div className="group relative p-8 sm:p-10 rounded-[32px] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] supports-[backdrop-filter]:bg-white/[0.01]">
              <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* Massive Editorial Background Number */}
              <div className="absolute -right-6 -top-10 text-[140px] font-black text-white/[0.015] select-none pointer-events-none group-hover:text-white/[0.03] transition-colors duration-500 leading-none tracking-tighter">
                01
              </div>

              <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/[0.05] group-hover:ring-white/[0.1] transition-all duration-500" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/10 to-transparent" />

              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-b from-white/[0.08] to-white/[0.01] border border-white/[0.08] shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:border-white/20">
                  <MapPin
                    className="h-7 w-7 text-white/70 group-hover:text-white transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mb-3.5 text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                  Curated Drop Zones
                </h3>
                <p className="text-base font-medium leading-relaxed text-[#8a8a8a] group-hover:text-white/80 transition-colors duration-500">
                  Meetups happen strictly at verified, public hotspots. Safety
                  is built into the coordinates. Zero sketchy residential
                  addresses.
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
                  <Zap
                    className="h-7 w-7 text-[#EFC88B]/70 group-hover:text-[#EFC88B] transition-colors duration-300 fill-[#EFC88B]/10"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mb-3.5 text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                  Expiring Connections
                </h3>
                <p className="text-base font-medium leading-relaxed text-[#8a8a8a] group-hover:text-white/80 transition-colors duration-500">
                  Matches unlock a temporary burner chat. Make the plan, meet
                  up, and let the history self-destruct. Live in the moment.
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
                  <Navigation
                    className="h-7 w-7 text-[#CF5C36]/70 group-hover:text-[#CF5C36] transition-colors duration-300 fill-[#CF5C36]/10"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mb-3.5 text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                  Proximity Unlock
                </h3>
                <p className="text-base font-medium leading-relaxed text-[#8a8a8a] group-hover:text-white/80 transition-colors duration-500">
                  Your exact location stays masked until you're both within a
                  500-meter radius of the venue. Ghosting solved by physics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </InteractiveGradientBackground>
    </main>
  );
}