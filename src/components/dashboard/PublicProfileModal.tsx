"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Star, Clock, Zap, Map, Users, Crown, Shield, Loader2, EyeOff } from "lucide-react";
import { getPublicUserProfileAction } from "@/actions/user";

interface PublicProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; 
}

export function PublicProfileModal({ isOpen, onClose, user }: PublicProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      setIsLoading(true);
      
      // Catch EVERY possible way the ID might be named
      const targetId = user.id || user._id || user.userId; 
      
      if (!targetId) {
        // THE FIX: If the ID is missing, we alert you immediately.
        console.error("CRITICAL: Modal received user without an ID!", user);
        alert("Developer Error: User ID is missing! The backend needs to pass 'id: user._id' to the frontend.");
        setIsLoading(false);
        return;
      }

      getPublicUserProfileAction(targetId).then((res) => {
        if (res.success) {
          setProfile(res.profile);
        } else {
          console.error("Failed to fetch profile:", res.error);
        }
        setIsLoading(false);
      });
    } else {
      setProfile(null);
    }
  }, [isOpen, user]);

  if (!user) return null;

  // --- BADGE ENGINE (Calculated on the fly once data loads) ---
  const earnedBadges = [];
  if (profile) {
    const totalRatings = (profile.badges?.trustworthy || 0) + (profile.badges?.entertainer || 0) + (profile.badges?.punctual || 0);

    // 1. Rating Badges
    if (profile.badges?.trustworthy > 0) earnedBadges.push({ id: "vault", name: "The Vault", count: profile.badges.trustworthy, icon: Shield, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" });
    if (profile.badges?.entertainer > 0) earnedBadges.push({ id: "entertainer", name: "Entertainer", count: profile.badges.entertainer, icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" });
    if (profile.badges?.punctual > 0) earnedBadges.push({ id: "clockwork", name: "Clockwork", count: profile.badges.punctual, icon: Clock, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" });

    // 2. Hosting Milestones
    if (profile.hostedCount >= 50) earnedBadges.push({ id: "h50", name: "City Legend", count: 1, icon: Crown, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" });
    else if (profile.hostedCount >= 10) earnedBadges.push({ id: "h10", name: "Vibe Architect", count: 1, icon: Map, color: "text-[#CF5C36]", bg: "bg-[#CF5C36]/10", border: "border-[#CF5C36]/20" });
    else if (profile.hostedCount >= 1) earnedBadges.push({ id: "h1", name: "Ice Breaker", count: 1, icon: Zap, color: "text-white/80", bg: "bg-white/5", border: "border-white/10" });

    // 3. Attending Milestones
    if (profile.attendedCount >= 50) earnedBadges.push({ id: "a50", name: "Inner Circle", count: 1, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" });
    else if (profile.attendedCount >= 10) earnedBadges.push({ id: "a10", name: "Social Butterfly", count: 1, icon: Users, color: "text-[#CF5C36]", bg: "bg-[#CF5C36]/10", border: "border-[#CF5C36]/20" });
    else if (profile.attendedCount >= 1) earnedBadges.push({ id: "a1", name: "The Explorer", count: 1, icon: Map, color: "text-white/80", bg: "bg-white/5", border: "border-white/10" });

    // 4. The Major Badge
    if (totalRatings >= 10) earnedBadges.push({ id: "paragon", name: "The Paragon", count: 1, icon: ShieldCheck, color: "text-[#EFC88B]", bg: "bg-gradient-to-br from-[#EFC88B]/20 to-[#CF5C36]/10", border: "border-[#EFC88B]/40" });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ y: "100%", scale: 0.95 }} 
            animate={{ y: 0, scale: 1 }} 
            exit={{ y: "100%", scale: 0.95 }} 
            transition={{ type: "spring", damping: 25, stiffness: 300 }} 
            className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* FIX 1: Moving overflow-y-auto to this wrapper so the avatar doesn't get clipped! */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-6">
              
              {/* Header Area */}
              <div className="h-32 bg-gradient-to-b from-[#CF5C36]/20 to-transparent relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-[#7C7C7C] hover:text-white transition-all backdrop-blur-md z-20">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 relative">
                {/* Avatar */}
                <div className="flex justify-between items-end -mt-16 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#CF5C36] rounded-full blur-md opacity-30" />
                    <img src={user.avatar} className="relative w-28 h-28 rounded-full border-4 border-[#0A0A0A] object-cover bg-[#111]" alt="Avatar" />
                  </div>
                  
                  {/* Score */}
                  <div className="flex flex-col items-end pb-2">
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 text-[#CF5C36] animate-spin mb-1" />
                    ) : profile?.isStatsVisible === false ? (
                      <EyeOff className="w-6 h-6 text-[#7C7C7C] mb-1" />
                    ) : (
                      <span className="text-3xl font-black text-[#CF5C36] leading-none tracking-tighter">{profile?.credibilityScore || 0}</span>
                    )}
                    <span className="text-[10px] text-[#7C7C7C] uppercase tracking-widest font-bold">Trust Score</span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                    {user.name}, {user.age} {profile && profile.isStatsVisible !== false && <ShieldCheck className="w-5 h-5 text-green-400" />}
                  </h2>
                  
                  {/* Bio */}
                  <div className="mt-3 min-h-[40px]">
                    {isLoading ? (
                      <div className="w-3/4 h-4 bg-white/5 rounded animate-pulse" />
                    ) : (
                      <p className="text-sm text-white/70 font-light leading-relaxed">
                        {profile?.bio || "This user prefers to let their vibes do the talking."}
                      </p>
                    )}
                  </div>
                </div>

                {/* FIX 2: Strict check for false, allowing it to render if true or undefined */}
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex gap-2"><div className="w-16 h-6 bg-white/5 rounded-full animate-pulse" /><div className="w-20 h-6 bg-white/5 rounded-full animate-pulse" /></div>
                    <div className="w-full h-32 bg-white/5 rounded-2xl animate-pulse mt-8" />
                  </div>
                ) : profile?.isStatsVisible === false ? (
                  <div className="p-8 rounded-[24px] bg-white/[0.02] border border-white/5 text-center mt-8">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-5 h-5 text-[#7C7C7C]" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Identity Vault Locked</h3>
                    <p className="text-xs text-[#7C7C7C]">This user has chosen to keep their ledger private.</p>
                  </div>
                ) : (
                  <>
                    {/* Rule of 3 Tags */}
                    {profile?.vibeTags && profile.vibeTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {profile.vibeTags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/90">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Badge Cabinet */}
                    <div>
                      <h3 className="text-xs font-bold text-[#7C7C7C] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-[#EFC88B]" /> Badge Cabinet
                      </h3>
                      
                      {earnedBadges.length === 0 ? (
                        <div className="p-6 rounded-2xl border border-white/5 border-dashed text-center">
                          <p className="text-xs text-[#7C7C7C] font-mono">No badges unlocked yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {earnedBadges.map(badge => (
                            <div key={badge.id} className={`p-3 rounded-2xl border flex items-center gap-3 ${badge.bg} ${badge.border}`}>
                              <div className={`p-2 rounded-full bg-black/20 ${badge.color}`}>
                                <badge.icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs font-bold truncate ${badge.color}`}>{badge.name}</span>
                                {badge.count > 1 && (
                                  <span className="text-[10px] font-mono opacity-70 text-white">Earned x{badge.count}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}