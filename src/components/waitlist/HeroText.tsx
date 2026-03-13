"use client";

import React from "react";

export function HeroText() {
  return (
    <>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-[#EFC88B] shadow-inner">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFC88B] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFC88B]"></span>
        </span>
        Early Access. Highly Limited.
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-[80px] font-semibold tracking-tighter mb-8 leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
        Your friends are busy. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CF5C36] via-[#E36940] to-[#EFC88B]">
          The city isn't.
        </span>
      </h1>

      <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
        Drop a vibe. Find your crowd. Meet up instantly. The city is waiting—start living.
      </p>
    </>
  );
}