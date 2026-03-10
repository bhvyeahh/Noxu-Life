"use client";

import React from "react";
import { Search, MapPin, Clock, List, Map as MapIcon, Sparkles } from "lucide-react";

interface BrowseProps {
  browseView: "list" | "map";
  setBrowseView: (view: "list" | "map") => void;
  beacons: any[];
  requestedIds: string[];
  setRequestingBeaconId: (id: string) => void;
}

export function BrowseView({ browseView, setBrowseView, beacons, requestedIds, setRequestingBeaconId }: BrowseProps) {
  return (
    <div className="px-4 sm:px-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      
      {/* Top Controls: Search & Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7C7C7C] group-focus-within:text-[#CF5C36] transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="Search vibes, venues, or people..." 
            className="w-full h-14 pl-14 pr-5 bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-full focus:border-[#CF5C36]/50 focus:bg-white/[0.03] outline-none transition-all duration-300 text-sm text-white placeholder:text-[#7C7C7C] shadow-inner supports-[backdrop-filter]:bg-black/40" 
          />
        </div>
        
        <div className="flex bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 shadow-inner supports-[backdrop-filter]:bg-black/40 sm:w-auto w-full">
          <button 
            onClick={() => setBrowseView("list")} 
            className={`flex-1 sm:w-14 flex items-center justify-center rounded-full h-11 transition-all duration-300 ${browseView === "list" ? "bg-white/10 text-white shadow-md" : "text-[#7C7C7C] hover:text-white"}`}
          >
            <List className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setBrowseView("map")} 
            className={`flex-1 sm:w-14 flex items-center justify-center rounded-full h-11 transition-all duration-300 ${browseView === "map" ? "bg-white/10 text-white shadow-md" : "text-[#7C7C7C] hover:text-white"}`}
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        <h2 className="text-xs font-bold text-[#7C7C7C] uppercase tracking-widest">Happening Nearby</h2>
      </div>
      
      {browseView === "list" && (
        <div className="flex flex-col gap-5">
          {beacons.map((beacon) => (
            <div 
              key={beacon.id} 
              className="group relative p-6 rounded-[32px] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#CF5C36]/5 flex flex-col sm:flex-row gap-5"
            >
              <div className="flex-shrink-0 relative">
                <img src={beacon.user.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-[#111] shadow-lg group-hover:border-white/10 transition-colors" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111]" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white tracking-tight">{beacon.title}</h3>
                  <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 bg-[#EFC88B]/10 text-[#EFC88B] rounded-full border border-[#EFC88B]/20 uppercase tracking-wider">
                    {beacon.spotsLeft} spot left
                  </span>
                </div>
                
                <p className="text-sm text-[#7C7C7C] mb-5 font-light leading-relaxed">
                  <span className="font-medium text-white/90">{beacon.user.name}</span> — {beacon.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-white/70 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-[#7C7C7C]" /> {beacon.time}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CF5C36]/10 rounded-full border border-[#CF5C36]/20 text-xs font-semibold text-[#CF5C36] backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5" /> {beacon.distance}
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 flex sm:flex-col justify-end sm:justify-center mt-2 sm:mt-0 z-10">
                {requestedIds.includes(beacon.id) ? (
                  <button disabled className="w-full sm:w-auto px-6 py-3 bg-white/5 text-white/40 text-sm font-semibold rounded-2xl border border-white/5 cursor-not-allowed transition-all">
                    Requested
                  </button>
                ) : (
                  <button 
                    onClick={() => setRequestingBeaconId(beacon.id)} 
                    className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-[#CF5C36] text-white text-sm font-semibold rounded-2xl border border-white/10 hover:border-[#CF5C36] transition-all duration-300 hover:shadow-[0_0_20px_rgba(207,92,54,0.3)] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {browseView === "map" && (
        <div className="relative w-full h-[65vh] bg-[#050505] rounded-[32px] border border-white/10 overflow-hidden flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] to-[#000000] animate-in fade-in zoom-in-95 duration-500 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {beacons.map((beacon) => (
            <div 
              key={beacon.id} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group" 
              style={beacon.mapPos} 
              onClick={() => setRequestingBeaconId(beacon.id)}
            >
              <div className="relative w-32 h-32 bg-[#CF5C36]/5 rounded-full border border-[#CF5C36]/20 flex items-center justify-center animate-pulse group-hover:bg-[#CF5C36]/15 transition-all duration-500">
                <div className="absolute w-16 h-16 bg-[#CF5C36]/10 rounded-full border border-[#CF5C36]/30 animate-ping opacity-50" />
                <img src={beacon.user.avatar} className="relative z-10 w-12 h-12 rounded-full border-2 border-[#CF5C36] shadow-[0_0_15px_rgba(207,92,54,0.5)] group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Premium Map Tooltip */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-max px-4 py-2 bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-2xl text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-xl flex items-center gap-2">
                <span className="font-bold text-[#CF5C36] tracking-tight">{beacon.title}</span> 
                <span className="text-white/30">•</span> 
                <span className="text-white/80 font-medium">{beacon.distance}</span>
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center gap-2.5 shadow-2xl supports-[backdrop-filter]:bg-black/40">
            <span className="w-2 h-2 bg-[#CF5C36] rounded-full animate-ping shadow-[0_0_8px_rgba(207,92,54,0.8)]" />
            <span className="text-xs text-white/70 font-medium whitespace-nowrap tracking-wide">Radiuses show general area. Venue hidden.</span>
          </div>
        </div>
      )}
    </div>
  );
}