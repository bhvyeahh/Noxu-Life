"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Camera, ChevronLeft, Loader2, Plus } from "lucide-react";

type AuthStep = "phone" | "otp" | "profile";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Profile State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  
  // OTP Input Refs for auto-advancing
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handlers for mocked transitions
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("profile");
    }, 1000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !gender) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Redirects to dashboard route
      window.location.href = "/dashboard"; 
    }, 1500);
  };

  return (
    <main className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-[#CF5C36]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      {/* Premium Centered Branding Navigation */}
      <div className="absolute top-12 left-0 right-0 flex items-center justify-center z-50 px-6">
        {step !== "phone" && (
          <button 
            onClick={() => setStep(step === "profile" ? "otp" : "phone")}
            className="absolute left-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <span className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-sm">
          Noxu.
        </span>
      </div>

      <div className="relative w-full max-w-sm z-10 mt-12">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: PHONE NUMBER */}
          {step === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Get Started</h1>
                <p className="text-[#7C7C7C] font-light">Enter your phone number to join the Inner Circle.</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-14 px-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="99999 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 h-14 px-5 bg-white/5 border border-white/10 rounded-2xl focus:border-[#CF5C36] text-white placeholder:text-[#7C7C7C] outline-none transition-all text-lg tracking-wide"
                  />
                </div>

                <button 
                  disabled={isLoading || phone.length < 10}
                  type="submit"
                  className="w-full h-14 bg-[#CF5C36] hover:bg-[#b04a29] text-white font-medium rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-[#CF5C36] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(207,92,54,0.3)]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
                </button>
              </form>
              <p className="mt-6 text-center text-xs text-[#7C7C7C] max-w-xs mx-auto leading-relaxed">
                By continuing, you agree to our Terms of Service and strictly public meetup policy.
              </p>
            </motion.div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Verify Code</h1>
                <p className="text-[#7C7C7C] font-light">We sent a 6-digit code to +91 {phone}</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl focus:border-[#CF5C36] text-white text-center text-xl font-medium outline-none transition-all"
                    />
                  ))}
                </div>

                <button 
                  disabled={isLoading || otp.join("").length < 6}
                  type="submit"
                  className="w-full h-14 bg-[#CF5C36] hover:bg-[#b04a29] text-white font-medium rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-[#CF5C36] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(207,92,54,0.3)]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Enter"}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: PROFILE SETUP (The Noxu Identity) */}
          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Your Identity</h1>
                <p className="text-[#7C7C7C] font-light">No bios. Just you and your vibe.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6 flex flex-col items-center">
                
                {/* Avatar Upload Mock */}
                <div className="relative w-28 h-28 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer group mb-2">
                  <Camera className="w-8 h-8 text-[#7C7C7C] group-hover:text-white transition-colors" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#CF5C36] rounded-full flex items-center justify-center border-2 border-black">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-2 h-14 px-5 bg-white/5 border border-white/10 rounded-2xl focus:border-[#CF5C36] text-white placeholder:text-[#7C7C7C] outline-none transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="col-span-1 h-14 px-5 bg-white/5 border border-white/10 rounded-2xl focus:border-[#CF5C36] text-white placeholder:text-[#7C7C7C] outline-none transition-all text-center"
                    />
                  </div>

                  {/* Strict Gender Selection */}
                  <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 mt-2">
                    <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-3 block">
                      Gender <span className="text-[#CF5C36]">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button 
                        type="button" 
                        onClick={() => setGender('male')} 
                        className={`h-12 rounded-xl border transition-all text-sm font-medium ${gender === 'male' ? 'bg-[#CF5C36]/20 border-[#CF5C36] text-[#CF5C36]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                      >
                        Male
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setGender('female')} 
                        className={`h-12 rounded-xl border transition-all text-sm font-medium ${gender === 'female' ? 'bg-[#CF5C36]/20 border-[#CF5C36] text-[#CF5C36]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                      >
                        Female
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setGender('other')} 
                        className={`h-12 rounded-xl border transition-all text-sm font-medium ${gender === 'other' ? 'bg-[#CF5C36]/20 border-[#CF5C36] text-[#CF5C36]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                      >
                        Other
                      </button>
                    </div>
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <span className="text-red-400 text-xs">⚠️</span>
                      <p className="text-[11px] text-red-400/90 font-medium leading-relaxed">
                        Choose carefully. For community safety and verification, gender cannot be changed after account creation.
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isLoading || !name || !age || !gender}
                  type="submit"
                  className="w-full h-14 mt-2 bg-[#CF5C36] hover:bg-[#b04a29] text-white font-medium rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-[#CF5C36] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(207,92,54,0.3)]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}