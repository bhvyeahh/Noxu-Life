"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Music, Utensils, Send, Loader2, AlertTriangle } from "lucide-react";
import { VenueAutocomplete } from "./VenueAutocomplete";
import { createBeaconAction } from "@/actions/beacon";
import { sendRequestAction } from "@/actions/request";

interface ModalsProps {
  isPosting: boolean;
  setIsPosting: (val: boolean) => void;
  requestingBeaconId: string | null;
  setRequestingBeaconId: (val: string | null) => void;
  icebreaker: string;
  setIcebreaker: (val: string) => void;
  handleSendRequest: () => void;
  onSuccess: () => void;
}

export function ActivityModals({
  isPosting, setIsPosting, requestingBeaconId, setRequestingBeaconId,
  icebreaker, setIcebreaker, handleSendRequest, onSuccess
}: ModalsProps) {
  
  // State for the Create Activity Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vibe, setVibe] = useState<"coffee" | "dining" | "culture" | "nightlife">("coffee");
  const [venue, setVenue] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: State for Sending Request
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  // --- POST BEACON LOGIC ---
  const handleBroadcast = async () => {
    if (!title || !description || !vibe || !venue) return;
    
    setIsSubmitting(true);
    const res = await createBeaconAction({
      title,
      description,
      vibe,
      venueName: venue.name,
      lat: venue.lat,
      lng: venue.lng
    });

    if (res.success) {
      setIsPosting(false);
      onSuccess(); // Refreshes the feed
      setTitle("");
      setDescription("");
      setVenue(null);
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  // --- SEND REQUEST LOGIC (Now hits MongoDB) ---
  const onSendRequestClick = async () => {
    if (!requestingBeaconId || !icebreaker.trim()) return;
    
    setIsSendingRequest(true);
    const res = await sendRequestAction(requestingBeaconId, icebreaker);
    
    if (res.success) {
      handleSendRequest(); // Updates the UI to show "Requested" state
    } else {
      alert(res.error || "Failed to send request.");
    }
    setIsSendingRequest(false);
  };

  return (
    <>
      {/* SEND REQUEST MODAL */}
      <AnimatePresence>
        {requestingBeaconId && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestingBeaconId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%", scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: "100%", scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl">
              <button onClick={() => setRequestingBeaconId(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#7C7C7C] hover:text-white transition-all"><X className="w-5 h-5" /></button>
              <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">Vibe Check</h2>
              <p className="text-[#7C7C7C] text-sm mb-6">Send an icebreaker message to request an invite. The spot isn't yours until they accept.</p>
              <div className="space-y-4">
                <textarea 
                  value={icebreaker} 
                  onChange={(e) => setIcebreaker(e.target.value)} 
                  placeholder="Hey, I'd love to join! I'm..." 
                  className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#CF5C36] text-sm text-white placeholder:text-[#7C7C7C] outline-none transition-all resize-none" 
                />
                <button 
                  onClick={onSendRequestClick} 
                  disabled={isSendingRequest || !icebreaker.trim()} 
                  className="w-full h-14 bg-[#CF5C36] hover:bg-[#b04a29] text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(207,92,54,0.4)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isSendingRequest ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send Request</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HORIZONTAL CREATE ACTIVITY MODAL */}
      <AnimatePresence>
        {isPosting && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPosting(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: "100%", scale: 0.95 }} 
              animate={{ y: 0, scale: 1 }} 
              exit={{ y: "100%", scale: 0.95 }} 
              transition={{ type: "spring", damping: 25, stiffness: 300 }} 
              className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col"
            >
              <button onClick={() => setIsPosting(false)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#7C7C7C] hover:text-white transition-all z-20"><X className="w-5 h-5" /></button>
              <h2 className="text-2xl font-semibold text-white mb-8 tracking-tight">Post a Beacon</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-3 block">The Vibe</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setVibe("coffee")} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${vibe === "coffee" ? "bg-[#CF5C36]/10 border-[#CF5C36] text-[#CF5C36]" : "bg-white/5 border-white/10 text-white/80 hover:border-[#CF5C36]/50"}`}><Coffee className="w-6 h-6" /><span className="text-xs font-medium">Coffee</span></button>
                      <button onClick={() => setVibe("dining")} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${vibe === "dining" ? "bg-[#CF5C36]/10 border-[#CF5C36] text-[#CF5C36]" : "bg-white/5 border-white/10 text-white/80 hover:border-[#CF5C36]/50"}`}><Utensils className="w-6 h-6" /><span className="text-xs font-medium">Dining</span></button>
                      <button onClick={() => setVibe("culture")} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${vibe === "culture" ? "bg-[#CF5C36]/10 border-[#CF5C36] text-[#CF5C36]" : "bg-white/5 border-white/10 text-white/80 hover:border-[#CF5C36]/50"}`}><Music className="w-6 h-6" /><span className="text-xs font-medium">Culture</span></button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-3 block">Activity Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Extra ticket for The Batman" className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#CF5C36] text-sm text-white placeholder:text-[#7C7C7C] outline-none transition-all" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-3 block">Details</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="e.g. I have an extra ticket in row G. Looking for a fellow DC fan to grab drinks beforehand." 
                      className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#CF5C36] text-sm text-white placeholder:text-[#7C7C7C] outline-none transition-all resize-none" 
                    />
                  </div>
                </div>

                <div className="flex flex-col h-full space-y-6">
                  <div className="relative z-50">
                    <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-3 block">Venue (Public Only)</label>
                    <VenueAutocomplete onSelect={setVenue} />
                  </div>

                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mt-auto">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-1">Safety Protocol</h4>
                      <p className="text-xs text-red-400/90 leading-relaxed">
                        Do not share your phone number, social handles, or exact table/apartment number. The exact venue name will remain hidden from the public feed until you manually accept a request.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleBroadcast} 
                    disabled={isSubmitting || !title || !description || !venue}
                    className="w-full mt-auto h-14 bg-[#CF5C36] hover:bg-[#b04a29] disabled:opacity-50 disabled:hover:bg-[#CF5C36] text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(207,92,54,0.4)] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Broadcast to Nearby"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}