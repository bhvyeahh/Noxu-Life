"use client";

import React from "react";

export function ProductHuntCard() {
  return (
    <div className="mt-20 sm:mt-24 mb-4 mx-auto w-full max-w-[420px] p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,97,84,0.15)] duration-500 animate-in fade-in slide-in-from-bottom-8 delay-700">
      <div className="flex items-center gap-4 mb-5">
        <img 
          alt="Noxu | The Inner Circle" 
          src="https://ph-files.imgix.net/fa850207-8b83-4398-aece-b6e117992254.png?auto=format&fit=crop&w=80&h=80" 
          className="w-16 h-16 rounded-[14px] object-cover flex-shrink-0 border border-white/10 shadow-inner"
        />
        <div className="flex-1 min-w-0 text-left">
          <h3 className="m-0 text-lg font-bold text-white leading-tight truncate tracking-tight">
            Noxu | The Inner Circle
          </h3>
          <p className="mt-1 text-sm font-medium text-white/50 leading-snug line-clamp-2">
            Your friends are busy. The city isn't.
          </p>
        </div>
      </div>
      <a 
        href="https://www.producthunt.com/products/noxu-the-inner-circle?embed=true&utm_source=embed&utm_medium=post_embed" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex w-full justify-center items-center gap-2 px-4 py-3 bg-[#FF6154] hover:bg-[#FF6154]/90 text-white decoration-none rounded-[12px] text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,97,84,0.2)] hover:shadow-[0_0_25px_rgba(255,97,84,0.4)] group"
      >
        Check it out on Product Hunt 
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </a>
    </div>
  );
}