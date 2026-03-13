"use client";

import React from "react";

export function BrandLogo() {
  return (
    <div className="flex justify-center mb-10 relative animate-in fade-in slide-in-from-top-8 duration-1000">
      <div className="absolute inset-0 bg-[#CF5C36]/20 blur-[50px] rounded-full w-32 h-32 mx-auto -top-6 pointer-events-none"></div>
      <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white relative z-10 flex items-center drop-shadow-md">
        NO
        <span className="relative inline-flex items-center justify-center mx-[2px]">
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-[#CF5C36] via-[#E36940] to-[#EFC88B]">
            X
          </span>
          <span className="absolute inset-0 bg-[#CF5C36] blur-[14px] opacity-80 scale-150 rounded-full mix-blend-screen pointer-events-none"></span>
        </span>
        U<span className="text-[#CF5C36] ml-[2px]">.</span>
      </h2>
    </div>
  );
}