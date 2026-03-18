"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Loader2, Sparkles, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { getCurrentUserAction, updateUserProfileAction } from "@/actions/user";

// Curated list of Vibe Tags
const ALL_TAGS = [
  "Spontaneous", "Deep Talks", "Thrill-seeker", "Foodie", "Night Owl",
  "Early Bird", "Coffee Snob", "Introvert", "Extrovert", "Creative",
  "Tech Geek", "Fitness Junkie", "Wanderlust", "Bookworm", "Music Lover",
  "Concert Goer", "Cinephile", "Art Enthusiast", "Zen", "Party Animal",
  "Outdoorsy", "Urban Explorer", "Gamer", "Spiritual", "Fashion Forward"
];

// The top 5 to show initially
const INITIAL_TAGS = ["Spontaneous", "Foodie", "Night Owl", "Deep Talks", "Thrill-seeker"];

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [bio, setBio] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isStatsVisible, setIsStatsVisible] = useState(true);
  
  // UI State
  const [showAllTags, setShowAllTags] = useState(false);
  const [userStats, setUserStats] = useState({ hosted: 0, attended: 0, trust: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setBio(res.user.bio);
        setSelectedTags(res.user.vibeTags);
        setIsStatsVisible(res.user.isStatsVisible);
        setUserStats({
          hosted: res.user.hostedCount,
          attended: res.user.attendedCount,
          trust: res.user.credibilityScore
        });
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 3) return; // Strict Rule of 3
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateUserProfileAction({ bio, vibeTags: selectedTags, isStatsVisible });
    if (res.success) {
      router.push("/dashboard");
    } else {
      alert(res.error || "Failed to save profile");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#CF5C36] animate-spin" />
      </div>
    );
  }

  const displayedTags = showAllTags ? ALL_TAGS : INITIAL_TAGS;

  return (
    <main className="min-h-screen bg-[#000000] text-[#EEE5E9] font-sans selection:bg-[#CF5C36]/30 pb-32">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,_rgba(207,92,54,0.08),_transparent_60%)]" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/[0.04] supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg tracking-tight">NOXU</span>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#CF5C36] hover:bg-[#b04a29] text-white text-sm font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(207,92,54,0.4)] disabled:opacity-50 flex items-center gap-2 active:scale-95"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Identity"}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="space-y-12">
          
          {/* SEC 1: THE BIO */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Your Bio</h2>
              <span className={`text-xs font-mono ${bio.length >= 160 ? "text-red-400" : "text-[#7C7C7C]"}`}>
                {bio.length}/160
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.substring(0, 160))}
              placeholder="Keep it authentic. Who are you in a sentence?"
              className="w-full h-32 p-5 bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-3xl focus:border-[#CF5C36]/50 focus:bg-white/[0.03] outline-none transition-all duration-300 resize-none text-sm leading-relaxed shadow-inner"
            />
          </section>

          {/* SEC 2: VIBE TAGS (The Rule of 3) */}
          <section className="space-y-5 relative">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-1 flex items-center gap-2">
                  Vibe Tags <Sparkles className="w-4 h-4 text-[#CF5C36]" />
                </h2>
                <p className="text-sm text-[#7C7C7C]">Select exactly 3 keywords that define your energy.</p>
              </div>
              <span className="text-xs font-bold font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <span className={selectedTags.length === 3 ? "text-[#CF5C36]" : "text-white"}>{selectedTags.length}</span>/3
              </span>
            </div>

            <motion.div layout className="flex flex-wrap gap-3">
              <AnimatePresence>
                {displayedTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const isDisabled = !isSelected && selectedTags.length >= 3;
                  return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      disabled={isDisabled}
                      className={`relative px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border overflow-hidden ${
                        isSelected 
                          ? "bg-[#CF5C36]/10 border-[#CF5C36] text-[#CF5C36] shadow-[0_0_15px_rgba(207,92,54,0.2)]" 
                          : isDisabled 
                            ? "bg-transparent border-white/5 text-white/20 cursor-not-allowed" 
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 active:scale-95"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {tag}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {!showAllTags && (
              <motion.button 
                layout
                onClick={() => setShowAllTags(true)}
                className="text-sm text-[#CF5C36] font-semibold hover:text-white transition-colors py-2"
              >
                + View All Tags
              </motion.button>
            )}
          </section>

          {/* SEC 3: TRUST LEDGER & PRIVACY */}
          <section className="space-y-6 pt-4 border-t border-white/5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-1 flex items-center gap-2">
                Trust Ledger <ShieldCheck className="w-4 h-4 text-green-400" />
              </h2>
              <p className="text-sm text-[#7C7C7C]">Your credibility score based on past vibes.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-white">{userStats.hosted}</span>
                <span className="text-[10px] text-[#7C7C7C] uppercase tracking-wider font-semibold">Hosted</span>
              </div>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-white">{userStats.attended}</span>
                <span className="text-[10px] text-[#7C7C7C] uppercase tracking-wider font-semibold">Attended</span>
              </div>
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#CF5C36]/20 to-transparent border border-[#CF5C36]/30 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-[#CF5C36]">{userStats.trust}</span>
                <span className="text-[10px] text-[#CF5C36]/70 uppercase tracking-wider font-semibold">Trust Score</span>
              </div>
            </div>

            {/* Apple-esque Toggle Switch */}
            <div className="flex items-center justify-between p-5 rounded-3xl bg-[#111111]/80 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isStatsVisible ? "bg-green-500/10 text-green-400" : "bg-white/5 text-[#7C7C7C]"}`}>
                  {isStatsVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Public Profile Stats</h3>
                  <p className="text-xs text-[#7C7C7C]">Let others see your ledger.</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsStatsVisible(!isStatsVisible)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${isStatsVisible ? 'bg-[#CF5C36]' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-md mx-1"
                  animate={{ x: isStatsVisible ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </section>

        </motion.div>
      </div>
    </main>
  );
}