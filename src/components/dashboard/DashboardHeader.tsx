"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ProfileModal } from "./ProfileModal";

interface HeaderProps {
  onPostClick: () => void;
  user: {
    name: string;
    avatar: string;
    phone?: string;
  } | null;
}

export function DashboardHeader({ onPostClick, user }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fallback avatar while loading
  const defaultAvatar = "https://api.dicebear.com/7.x/notionists/svg?seed=fallback";

  return (
    <>
      {/* Apple-style heavy blur and subtle border */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-4 pt-safe supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 drop-shadow-sm">
            Noxu.
          </h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onPostClick}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#CF5C36] to-[#b04a29] hover:from-[#E36940] hover:to-[#CF5C36] text-white rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(207,92,54,0.3)] hover:shadow-[0_0_25px_rgba(207,92,54,0.5)] border border-white/10"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span className="hidden sm:inline text-white/95 tracking-wide">Post Activity</span>
            </button>

            {/* Premium Avatar Trigger */}
            <button 
              onClick={() => setIsProfileOpen(true)} 
              className="relative group outline-none focus:ring-2 focus:ring-[#CF5C36]/50 rounded-full transition-all"
            >
              <div className="absolute inset-0 bg-[#CF5C36] rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              <img 
                src={user?.avatar || defaultAvatar} 
                alt="Profile" 
                className="relative w-10 h-10 rounded-full border border-white/10 object-cover bg-[#0A0A0A] group-hover:border-[#CF5C36]/50 transition-all z-10 shadow-lg"
              />
            </button>
          </div>

        </div>
      </header>

      {/* RENDER THE MODAL WITH REAL DATA */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user} 
      />
    </>
  );
}