"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Camera, ChevronLeft, Loader2, Plus, AlertCircle, Sparkles } from "lucide-react";
import { sendOtpAction, verifyOtpAction, completeProfileAction } from "@/actions/auth";

type AuthStep = "phone" | "otp" | "profile";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Profile State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  
  // OTP Input Refs for auto-advancing
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Send OTP
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    setIsLoading(true);
    setErrorMessage("");
    
    const res = await sendOtpAction(phone);
    
    if (res.success) {
      setStep("otp");
    } else {
      setErrorMessage(res.error || "Failed to send code.");
    }
    setIsLoading(false);
  };

  // OTP Auto-advance logic
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // 2. Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) return;

    setIsLoading(true);
    setErrorMessage("");

    const res = await verifyOtpAction(phone, otpCode);

    if (res.success) {
      if (res.isNewUser) {
        // First time logging in -> Go to profile setup
        setStep("profile");
      } else {
        // Existing user -> Cookie is set, go straight to dashboard
        window.location.href = "/dashboard";
      }
    } else {
      setErrorMessage(res.error || "Invalid code.");
    }
    setIsLoading(false);
  };

  // 3. Complete Profile Setup
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !gender) return;

    setIsLoading(true);
    setErrorMessage("");

    const res = await completeProfileAction(phone, name, parseInt(age), gender);

    if (res.success) {
      // Profile created and Cookie set -> Go to dashboard
      window.location.href = "/dashboard";
    } else {
      setErrorMessage(res.error || "Failed to create profile.");
    }
    setIsLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Premium Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#CF5C36]/15 via-[#CF5C36]/[0.03] to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-[#CF5C36]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      {/* Premium Centered Branding Navigation */}
      <div className="absolute top-12 left-0 right-0 flex items-center justify-center z-50 px-6">
        {step !== "phone" && (
          <button 
            onClick={() => {
              setErrorMessage("");
              setStep(step === "profile" ? "otp" : "phone");
            }}
            className="absolute left-6 p-2.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white transition-all shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <span className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 drop-shadow-sm">
          Noxu.
        </span>
      </div>

      <div className="relative w-full max-w-sm z-10 mt-12">
        
        {/* Premium Error Message Toast */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute -top-16 left-0 right-0 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 text-red-500 text-sm font-semibold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-2xl"
            >
              <AlertCircle className="w-4 h-4" /> {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: PHONE NUMBER */}
          {step === "phone" && (
            <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="w-full">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Get Started</h1>
                <p className="text-[#7C7C7C] font-medium tracking-wide">Enter your phone number to join the Inner Circle.</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="group flex items-center gap-3 bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 focus-within:border-[#CF5C36]/50 focus-within:bg-white/[0.05] rounded-2xl transition-all duration-300 shadow-inner p-1.5 pl-4">
                  <div className="flex items-center justify-center text-white/70 font-semibold border-r border-white/10 pr-3">+91</div>
                  <input
                    type="tel"
                    placeholder="99999 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 h-12 bg-transparent text-white placeholder:text-[#7C7C7C] outline-none transition-all text-lg tracking-wider font-medium"
                  />
                </div>

                <button 
                  disabled={isLoading || phone.length < 10}
                  type="submit"
                  className="w-full h-14 bg-gradient-to-b from-[#CF5C36] to-[#b04a29] hover:from-[#E36940] hover:to-[#CF5C36] text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:grayscale-[0.5] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(207,92,54,0.3)] hover:shadow-[0_0_25px_rgba(207,92,54,0.5)] border border-white/10 active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
                </button>
              </form>
              <p className="mt-8 text-center text-[11px] text-[#7C7C7C] max-w-xs mx-auto leading-relaxed font-medium uppercase tracking-widest">
                By continuing, you agree to our Terms & Public Meetup Policy.
              </p>
            </motion.div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="w-full">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Verify Code</h1>
                <p className="text-[#7C7C7C] font-medium tracking-wide">We sent a 6-digit code to +91 {phone}</p>
                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-[#CF5C36]/10 border border-[#CF5C36]/20 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#CF5C36]" />
                  <p className="text-[#CF5C36] text-[10px] font-bold uppercase tracking-widest">DEV MODE: Enter 123456</p>
                </div>
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
                      className="w-12 h-14 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl focus:border-[#CF5C36] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(207,92,54,0.2)] text-white text-center text-xl font-bold outline-none transition-all duration-300 shadow-inner"
                    />
                  ))}
                </div>

                <button 
                  disabled={isLoading || otp.join("").length < 6}
                  type="submit"
                  className="w-full h-14 bg-gradient-to-b from-[#CF5C36] to-[#b04a29] hover:from-[#E36940] hover:to-[#CF5C36] text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:grayscale-[0.5] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(207,92,54,0.3)] hover:shadow-[0_0_25px_rgba(207,92,54,0.5)] border border-white/10 active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Enter"}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: PROFILE SETUP */}
          {step === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Your Identity</h1>
                <p className="text-[#7C7C7C] font-medium tracking-wide">No bios. Just you and your vibe.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6 flex flex-col items-center">
                
                {/* Premium Avatar Upload Placeholder */}
                <div className="relative w-28 h-28 rounded-full bg-white/[0.02] backdrop-blur-2xl border-2 border-dashed border-white/20 flex items-center justify-center hover:bg-white/[0.05] hover:border-[#CF5C36]/50 transition-all duration-300 cursor-pointer group mb-2 shadow-xl">
                  <Camera className="w-8 h-8 text-[#7C7C7C] group-hover:text-white transition-colors duration-300" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-b from-[#CF5C36] to-[#b04a29] rounded-full flex items-center justify-center border-2 border-black shadow-lg group-hover:scale-110 transition-transform duration-300">
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
                      className="col-span-2 h-14 px-5 bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-2xl focus:border-[#CF5C36] focus:bg-white/[0.05] text-white placeholder:text-[#7C7C7C] outline-none transition-all duration-300 shadow-inner font-medium" 
                    />
                    <input 
                      type="number" 
                      placeholder="Age" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)} 
                      className="col-span-1 h-14 px-5 bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-2xl focus:border-[#CF5C36] focus:bg-white/[0.05] text-white placeholder:text-[#7C7C7C] outline-none transition-all duration-300 text-center shadow-inner font-medium" 
                    />
                  </div>

                  {/* Premium Segmented Gender Control */}
                  <div className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-4 mt-2 shadow-2xl">
                    <label className="text-[10px] font-bold text-[#7C7C7C] uppercase tracking-widest mb-3 block pl-1">
                      Gender <span className="text-[#CF5C36]">*</span>
                    </label>
                    
                    <div className="flex bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-1 mb-4 shadow-inner">
                      <button type="button" onClick={() => setGender('male')} className={`flex-1 h-11 rounded-xl transition-all duration-300 text-sm font-semibold ${gender === 'male' ? 'bg-white/10 text-white shadow-md' : 'text-[#7C7C7C] hover:text-white'}`}>Male</button>
                      <button type="button" onClick={() => setGender('female')} className={`flex-1 h-11 rounded-xl transition-all duration-300 text-sm font-semibold ${gender === 'female' ? 'bg-white/10 text-white shadow-md' : 'text-[#7C7C7C] hover:text-white'}`}>Female</button>
                      <button type="button" onClick={() => setGender('other')} className={`flex-1 h-11 rounded-xl transition-all duration-300 text-sm font-semibold ${gender === 'other' ? 'bg-white/10 text-white shadow-md' : 'text-[#7C7C7C] hover:text-white'}`}>Other</button>
                    </div>

                    <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-red-400/90 font-semibold leading-relaxed">
                        Choose carefully. For community safety, gender cannot be changed later.
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isLoading || !name || !age || !gender}
                  type="submit"
                  className="w-full h-14 mt-4 bg-gradient-to-b from-[#CF5C36] to-[#b04a29] hover:from-[#E36940] hover:to-[#CF5C36] text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:grayscale-[0.5] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(207,92,54,0.3)] hover:shadow-[0_0_25px_rgba(207,92,54,0.5)] border border-white/10 active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                  {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}