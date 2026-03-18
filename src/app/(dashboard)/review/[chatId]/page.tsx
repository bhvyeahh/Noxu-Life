"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Clock, Zap, Star, AlertOctagon, CheckCircle2, Loader2, Award } from "lucide-react";
import { submitReviewAction, getReviewTargetAction } from "@/actions/review";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;

  // --- STATE ---
  const [phase, setPhase] = useState<"loading" | "gate" | "analysis" | "submitting">("loading");
  const [isNuking, setIsNuking] = useState(false);
  
  // Dynamic Target Data
  const [targetUser, setTargetUser] = useState<{ id: string, name: string, avatar: string, role: "host"|"guest" } | null>(null);
  
  // Rating States
  const [safety, setSafety] = useState<number>(0);
  const [punctuality, setPunctuality] = useState<number>(0);
  const [authenticity, setAuthenticity] = useState<number>(0);
  const [badge, setBadge] = useState<"trustworthy" | "entertainer" | "punctual" | "none">("none");

  // Fetch the real target user when the page loads
  useEffect(() => {
    const fetchTarget = async () => {
      const res = await getReviewTargetAction(chatId);
      if (res.success && res.targetUserId) {
        setTargetUser({
          id: res.targetUserId,
          name: res.targetName,
          avatar: res.targetAvatar,
          role: res.targetRole as "host" | "guest"
        });
        setPhase("gate");
      } else {
        alert("Failed to load review data. " + (res.error || ""));
        router.push("/dashboard");
      }
    };
    fetchTarget();
  }, [chatId, router]);

  // --- HANDLERS ---
  const handleFlake = async () => {
    if (!targetUser) return;
    setIsNuking(true);
    
    // Instant -50 Penalty using REAL ID
    await submitReviewAction({
      targetUserId: targetUser.id,
      didShowUp: false,
      role: targetUser.role
    });
    
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  const handleShowedUp = () => {
    setPhase("analysis");
  };

  const handleSubmitReview = async () => {
    if (safety === 0 || punctuality === 0 || authenticity === 0 || !targetUser) return;
    
    setPhase("submitting");
    const res = await submitReviewAction({
      targetUserId: targetUser.id,
      didShowUp: true,
      safety,
      punctuality,
      authenticity,
      badge,
      role: targetUser.role
    });
    
    if (res.success) {
      router.push("/dashboard");
    } else {
      alert("Failed to save review.");
      setPhase("analysis");
    }
  };

  // --- UI COMPONENTS ---
  const RatingSegment = ({ label, value, setter, icon: Icon }: any) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#7C7C7C] uppercase tracking-widest flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" /> {label}
        </label>
        <span className="text-[#CF5C36] font-mono text-xs font-bold">{value > 0 ? `${value}/5` : 'REQ'}</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setter(num)}
            className={`flex-1 h-12 rounded-xl border font-mono text-sm transition-all duration-300 ${
              value >= num 
                ? "bg-[#CF5C36]/10 border-[#CF5C36] text-[#CF5C36] shadow-[0_0_15px_rgba(207,92,54,0.2)]" 
                : "bg-white/5 border-white/10 text-white/30 hover:border-white/20"
            }`}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#000000] text-[#EEE5E9] font-sans overflow-hidden relative flex flex-col justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(207,92,54,0.03),_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {phase === "loading" && (
          <motion.div key="loading" exit={{ opacity: 0 }} className="relative z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#CF5C36] animate-spin mb-4" />
            <p className="text-[#7C7C7C] font-mono text-xs uppercase tracking-widest">Establishing Secure Link...</p>
          </motion.div>
        )}

        {phase === "gate" && targetUser && (
          <motion.div 
            key="gate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-md w-full mx-auto px-6 text-center"
          >
            {isNuking ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-40 animate-pulse" />
                  <AlertOctagon className="w-20 h-20 text-red-500 relative z-10 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-500 tracking-tight uppercase mb-2">Penalty Executed</h2>
                  <p className="text-red-400/70 text-sm font-mono">-50 Credibility Score Applied</p>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-[#CF5C36] rounded-full blur-xl opacity-20 animate-pulse" />
                  <img src={targetUser.avatar} className="relative w-full h-full rounded-full border-2 border-white/10 shadow-2xl object-cover" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">The rendezvous.</h1>
                <p className="text-[#7C7C7C] text-sm mb-12">Did <strong className="text-white">{targetUser.name}</strong> successfully arrive at the designated location?</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFlake}
                    className="h-16 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/50 text-red-500 font-bold tracking-wider uppercase text-xs rounded-2xl transition-all"
                  >
                    No (Flaked)
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShowedUp}
                    className="h-16 bg-[#CF5C36] hover:bg-[#b04a29] text-white font-bold tracking-wider uppercase text-xs rounded-2xl shadow-[0_0_20px_rgba(207,92,54,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    Yes <CheckCircle2 className="w-4 h-4" />
                  </motion.button>
                </div>
                <p className="mt-8 text-[10px] text-[#7C7C7C] font-mono uppercase tracking-widest opacity-50">Truth protocol strictly enforced.</p>
              </>
            )}
          </motion.div>
        )}

        {phase === "analysis" && targetUser && (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }}
            className="relative z-10 max-w-lg w-full mx-auto px-6 py-12"
          >
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Seal the Ledger</h1>
              <p className="text-[#7C7C7C] text-xs uppercase tracking-widest font-mono">Calibrate {targetUser.name}'s trust profile</p>
            </div>

            <div className="space-y-8 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] shadow-2xl">
              
              <RatingSegment label="Safety & Respect" value={safety} setter={setSafety} icon={Shield} />
              <RatingSegment label="Punctuality" value={punctuality} setter={setPunctuality} icon={Clock} />
              <RatingSegment label="Authentic Vibe" value={authenticity} setter={setAuthenticity} icon={Zap} />

              <div className="pt-6 border-t border-white/5">
                <label className="text-xs font-bold text-[#7C7C7C] uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Award className="w-3.5 h-3.5" /> Award a Badge (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "trustworthy", label: "Trustworthy", icon: Shield },
                    { id: "entertainer", label: "Entertainer", icon: Star },
                    { id: "punctual", label: "Punctual", icon: Clock },
                    { id: "none", label: "None", icon: Zap }
                  ].map((b) => (
                    <motion.button
                      key={b.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBadge(b.id as any)}
                      className={`h-12 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                        badge === b.id 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-transparent border-white/5 text-[#7C7C7C] hover:bg-white/5"
                      }`}
                    >
                      <b.icon className="w-3.5 h-3.5" /> {b.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitReview}
                disabled={safety === 0 || punctuality === 0 || authenticity === 0}
                className="w-full h-14 mt-4 bg-gradient-to-r from-[#CF5C36] to-[#E36940] text-white font-bold tracking-widest uppercase text-xs rounded-2xl shadow-[0_0_20px_rgba(207,92,54,0.4)] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center"
              >
                Submit Analysis
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "submitting" && (
          <motion.div 
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center justify-center"
          >
            <Loader2 className="w-10 h-10 text-[#CF5C36] animate-spin mb-4" />
            <p className="text-[#7C7C7C] font-mono text-xs uppercase tracking-widest animate-pulse">Encrypting Ledger...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}