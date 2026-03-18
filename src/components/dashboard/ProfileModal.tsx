"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Loader2, UserCog, ShieldCheck, ChevronRight } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatar: string;
    phone?: string;
  } | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    window.location.href = "/login"; 
  };

  const handleEditProfile = () => {
    onClose(); // Close the modal
    router.push("/profile"); // Route to the new premium full-page editor
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Ambient Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          {/* Premium Side Panel */}
          <motion.div 
            initial={{ x: "100%", opacity: 0.5 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: "100%", opacity: 0.5 }} 
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="relative w-full max-w-sm h-full bg-[#0A0A0A]/90 backdrop-blur-3xl border-l border-white/10 p-6 flex flex-col shadow-2xl supports-[backdrop-filter]:bg-[#0A0A0A]/70 font-sans z-10"
          >
            {/* Edge Highlight */}
            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <div className="flex items-center justify-between mb-8 mt-2 px-2">
              <h2 className="text-lg font-bold text-white tracking-wide uppercase text-[10px] opacity-50">Identity Vault</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-[#7C7C7C] hover:text-white transition-all outline-none active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Premium User Card */}
            <div className="flex flex-col items-center p-8 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[32px] mb-8 relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#CF5C36]/20 blur-[50px] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
              
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-[#CF5C36] rounded-full blur-xl opacity-20 animate-pulse" />
                <img 
                  src={user?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=fallback"} 
                  alt="Profile" 
                  className="relative w-24 h-24 rounded-full border-2 border-white/10 shadow-2xl bg-[#0A0A0A] object-cover ring-4 ring-black" 
                />
              </div>
              
              <h3 className="text-2xl font-semibold text-white tracking-tight relative z-10">{user?.name || "User"}</h3>
              
              <div className="flex items-center gap-1.5 mt-3 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full relative z-10 backdrop-blur-md shadow-inner">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Verified</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-3 mb-auto">
              <button 
                onClick={handleEditProfile}
                className="group w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all duration-300 border border-white/5 hover:border-white/10 outline-none active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="p-2 rounded-full bg-white/5 text-[#7C7C7C] group-hover:text-white group-hover:bg-[#CF5C36]/20 group-hover:text-[#CF5C36] transition-colors">
                    <UserCog className="w-4 h-4" />
                  </div>
                  Edit Identity
                </div>
                <ChevronRight className="w-4 h-4 text-[#7C7C7C] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Danger Zone */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300 text-sm font-semibold border border-red-500/10 hover:border-red-500/30 mt-4 disabled:opacity-50 outline-none active:scale-[0.98]"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" /> 
                  Disconnect Session
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}