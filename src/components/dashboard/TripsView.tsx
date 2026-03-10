"use client";

import React from "react";
import { Plane } from "lucide-react";

export function TripsView() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6">
        <Plane className="w-8 h-8 text-[#EFC88B]" />
      </div>
      <h2 className="text-2xl font-medium text-white mb-2">Noxu Trips</h2>
      <p className="text-[#7C7C7C] text-sm max-w-sm mx-auto">
        Curated group trips and spontaneous weekend getaways are dropping in Phase 2.
      </p>
    </div>
  );
}