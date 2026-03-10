"use client";

import React from "react";
import { Compass, MessageSquare, Plane } from "lucide-react";
import { GlassDock } from "@/components/ui/liquid-glass";

interface DockProps {
  activeTab: "browse" | "inbox" | "trips";
  setActiveTab: (tab: "browse" | "inbox" | "trips") => void;
}

export function DashboardDock({ activeTab, setActiveTab }: DockProps) {
  return (
    <GlassDock className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto min-w-[280px] justify-center px-2 py-2 gap-2 z-40 bg-black/50 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl supports-[backdrop-filter]:bg-black/20 flex items-center">
      
      <button 
        onClick={() => setActiveTab("browse")} 
        className={`relative flex flex-col items-center gap-1 w-20 py-2 rounded-[20px] transition-all duration-300 ${activeTab === "browse" ? "text-white bg-white/10 shadow-inner" : "text-[#7C7C7C] hover:text-white/80 hover:bg-white/5"}`}
      >
        <Compass className={`w-5 h-5 ${activeTab === "browse" ? "text-[#CF5C36]" : ""}`} strokeWidth={activeTab === "browse" ? 2.5 : 2} />
        <span className="text-[10px] font-semibold tracking-wide">Browse</span>
      </button>
      
      <button 
        onClick={() => setActiveTab("inbox")} 
        className={`relative flex flex-col items-center gap-1 w-20 py-2 rounded-[20px] transition-all duration-300 ${activeTab === "inbox" ? "text-white bg-white/10 shadow-inner" : "text-[#7C7C7C] hover:text-white/80 hover:bg-white/5"}`}
      >
        <MessageSquare className={`w-5 h-5 ${activeTab === "inbox" ? "text-[#CF5C36]" : ""}`} strokeWidth={activeTab === "inbox" ? 2.5 : 2} />
        <span className="absolute top-1.5 right-5 w-2 h-2 bg-[#CF5C36] rounded-full border border-black shadow-[0_0_8px_rgba(207,92,54,0.8)] animate-pulse" />
        <span className="text-[10px] font-semibold tracking-wide">Inbox</span>
      </button>
      
      <button 
        onClick={() => setActiveTab("trips")} 
        className={`relative flex flex-col items-center gap-1 w-20 py-2 rounded-[20px] transition-all duration-300 ${activeTab === "trips" ? "text-white bg-white/10 shadow-inner" : "text-[#7C7C7C] hover:text-white/80 hover:bg-white/5"}`}
      >
        <Plane className={`w-5 h-5 ${activeTab === "trips" ? "text-[#CF5C36]" : ""}`} strokeWidth={activeTab === "trips" ? 2.5 : 2} />
        <span className="text-[10px] font-semibold tracking-wide">Trips</span>
      </button>
      
    </GlassDock>
  );
}