"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { GlassButton } from "@/components/ui/liquid-glass";
import { joinWaitlist, getWaitlistCount } from "@/actions/waitlist";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState<number>(0);

  useEffect(() => {
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

  return (
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

      {error && (
        <p className="absolute -bottom-12 left-0 right-0 text-red-400 text-xs sm:text-sm font-medium text-center bg-red-500/10 py-1.5 px-4 rounded-full border border-red-500/20 w-max mx-auto backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300">
          {error}
        </p>
      )}

      {waitlistCount !== null && (
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-[20px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-all duration-300 group">
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

            <div className="flex -space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#CF5C36] to-black border border-white/20 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#EFC88B] via-[#CF5C36] to-[#3a1a10] border border-white/20 shadow-lg relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/20 shadow-lg flex items-center justify-center backdrop-blur-md z-20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                <span className="text-[10px] font-bold text-white/80 z-10">+</span>
              </div>
            </div>

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
  );
}