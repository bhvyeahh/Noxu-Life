"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Loader2, Settings, Shield } from "lucide-react";
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    window.location.href = "/login"; // Force a hard redirect to clear all client state
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Clickable background to close */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
          />
          
          {/* Side Panel */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-sm h-full bg-[#050505]/95 backdrop-blur-3xl border-l border-white/10 p-6 flex flex-col shadow-2xl supports-[backdrop-filter]:bg-[#050505]/80 font-sans z-10"
          >
            <div className="flex items-center justify-between mb-8 mt-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Inner Circle</h2>
              <button onClick={onClose} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#7C7C7C] hover:text-white transition-all outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Info Card */}
            <div className="flex flex-col items-center p-8 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 rounded-[32px] mb-8 relative overflow-hidden shadow-2xl">
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#CF5C36]/20 to-transparent opacity-40 pointer-events-none" />
              
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-[#CF5C36] rounded-full blur-xl opacity-20 animate-pulse" />
                <img 
                  src={user?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=fallback"} 
                  alt="Profile" 
                  className="relative w-24 h-24 rounded-full border border-white/10 shadow-2xl bg-[#0A0A0A] object-cover" 
                />
              </div>
              
              <h3 className="text-xl font-semibold text-white tracking-tight relative z-10">{user?.name || "User"}</h3>
              
              <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full relative z-10 backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Verified Identity</span>
              </div>
            </div>

            {/* Settings Links */}
            <div className="space-y-3 mb-auto">
              <button className="group w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all duration-300 text-sm font-medium border border-white/5 hover:border-white/10 outline-none">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-[#7C7C7C] group-hover:text-white transition-colors" />
                  Account Settings
                </div>
                {/* CSS-only hover reveal for V2 feature */}
                <span className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[10px] text-[#CF5C36] uppercase tracking-wider font-bold bg-[#CF5C36]/10 px-2 py-1 rounded-md">
                  Coming Soon
                </span>
              </button>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300 text-sm font-semibold border border-red-500/20 mt-4 disabled:opacity-50 outline-none hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                  Disconnect
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}