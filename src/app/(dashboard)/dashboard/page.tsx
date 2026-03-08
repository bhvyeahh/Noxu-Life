"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Plus, Compass, MessageSquare, Plane, Users, X, Coffee, Music, Utensils, AlertTriangle, Send, ChevronLeft, Timer, Check, MessageCircle, Ban, List, Map as MapIcon, Navigation } from "lucide-react";
import { GlassDock } from "@/components/ui/liquid-glass";

// --- INITIAL DATA ---
const INITIAL_BEACONS = [
  { 
    id: "b1", 
    user: { name: "Sarah", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" }, 
    title: "Working & Matcha", 
    description: "Got a table at Blue Bottle. Bring your laptop, let's co-work for a few hours.", 
    time: "Today, 2:00 PM", 
    location: "Blue Bottle, Williamsburg", 
    distance: "0.8 km", 
    spotsLeft: 1,
    mapPos: { top: "35%", left: "40%" } 
  },
  { 
    id: "b2", 
    user: { name: "Marcus", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" }, 
    title: "Extra ticket for The Batman", 
    description: "Friend bailed. I have one extra IMAX ticket. Movie starts at 8.", 
    time: "Tonight, 8:00 PM", 
    location: "AMC Lincoln Square", 
    distance: "2.1 km", 
    spotsLeft: 1,
    mapPos: { top: "60%", left: "70%" }
  },
];

const INITIAL_REQUESTS = [
  { id: "r1", user: { name: "David", age: 26, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" }, beaconTitle: "Extra ticket for The Batman", message: "Huge DC fan here! Would love to grab that ticket and grab a drink before the movie.", status: "pending", timeAgo: "10m ago" },
  { id: "r2", user: { name: "Aisha", age: 24, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" }, beaconTitle: "Working & Matcha", message: "I'm actually working on a coding project nearby, definitely need some matcha right now.", status: "hold", timeAgo: "1h ago" }
];

// --- INITIAL CHAT ---
const INITIAL_CHATS = [
  { 
    id: "c1", 
    user: { name: "Elena", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }, 
    beaconTitle: "Late night ramen", 
    location: "Ichiran, Times Square",
    expiresIn: "14h 22m left",
    messages: [
      { id: "m1", senderId: "them", text: "Hey! Saw you accepted. You close by?", timestamp: "8:02 PM" },
      { id: "m2", senderId: "me", text: "Yeah just walking over now, be there in 5.", timestamp: "8:05 PM" },
      { id: "m3", senderId: "them", text: "Perfect, I'm waiting outside the front door.", timestamp: "8:06 PM" },
    ]
  }
];

type Tab = "browse" | "inbox" | "trips";
type InboxView = "requests" | "active";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [browseView, setBrowseView] = useState<"list" | "map">("list");
  const [inboxView, setInboxView] = useState<InboxView>("requests");
  
  // Dynamic State
  const [beacons, setBeacons] = useState(INITIAL_BEACONS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeChats, setActiveChats] = useState<any[]>(INITIAL_CHATS);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  
  // Modals & Chat State
  const [isPosting, setIsPosting] = useState(false);
  const [openedChatId, setOpenedChatId] = useState<string | null>(null);
  const [requestingBeaconId, setRequestingBeaconId] = useState<string | null>(null);
  const [icebreaker, setIcebreaker] = useState("");

  // --- ACTIONS ---
  const handleSendRequest = () => {
    if (requestingBeaconId) {
      setRequestedIds([...requestedIds, requestingBeaconId]);
      setRequestingBeaconId(null);
      setIcebreaker("");
    }
  };

  const handleAccept = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (req) {
      const newChat = {
        id: `c-${req.id}`,
        user: req.user,
        beaconTitle: req.beaconTitle,
        location: "Venue Revealed", // In real app, this comes from the beacon data
        expiresIn: "23h 59m left",
        messages: [{ id: "m1", senderId: "them", text: req.message, timestamp: "Just now" }]
      };
      setActiveChats([newChat, ...activeChats]);
      setRequests(requests.filter(r => r.id !== requestId));
      setInboxView("active");
    }
  };

  const handleHold = (requestId: string) => {
    setRequests(requests.map(r => r.id === requestId ? { ...r, status: "hold" } : r));
  };

  const handleDecline = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const activeChat = activeChats.find(c => c.id === openedChatId);

  return (
    <main className="relative min-h-screen bg-[#000000] text-[#EEE5E9] selection:bg-[#CF5C36] selection:text-white pb-32">
      
      {/* Top Header (Hides when inside a specific chat) */}
      {!openedChatId && (
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tighter">Noxu.</h1>
            <button 
              onClick={() => setIsPosting(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#CF5C36] hover:bg-[#b04a29] text-white rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(207,92,54,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post Activity</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto pt-8">
        
        {/* TAB 1: BROWSE EVENTS */}
        {activeTab === "browse" && !openedChatId && (
          <div className="px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7C7C7C]" />
                <input 
                  type="text" 
                  placeholder="Search activities, venues, or vibes..." 
                  className="w-full h-12 pl-12 pr-4 bg-[#0A0A0A] border border-white/10 rounded-2xl focus:border-[#CF5C36]/50 focus:bg-[#111] outline-none transition-all text-sm placeholder:text-[#7C7C7C]" 
                />
              </div>
              <div className="flex bg-[#0A0A0A] border border-white/10 rounded-2xl p-1">
                <button onClick={() => setBrowseView("list")} className={`w-12 flex items-center justify-center rounded-xl transition-all ${browseView === "list" ? "bg-white/10 text-white shadow-sm" : "text-[#7C7C7C]"}`}>
                  <List className="w-5 h-5" />
                </button>
                <button onClick={() => setBrowseView("map")} className={`w-12 flex items-center justify-center rounded-xl transition-all ${browseView === "map" ? "bg-white/10 text-white shadow-sm" : "text-[#7C7C7C]"}`}>
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-[#7C7C7C] uppercase tracking-wider mb-4 px-2">Happening Nearby</h2>
            
            {browseView === "list" && (
              <div className="flex flex-col gap-4">
                {beacons.map((beacon) => (
                  <div key={beacon.id} className="group relative p-5 rounded-[24px] bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col sm:flex-row gap-5">
                    <div className="flex-shrink-0">
                      <img src={beacon.user.avatar} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-medium text-white">{beacon.title}</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-white/5 text-[#EFC88B] rounded-lg border border-white/10">{beacon.spotsLeft} spot left</span>
                      </div>
                      <p className="text-sm text-[#7C7C7C] mb-4 font-light leading-relaxed">
                        <span className="font-medium text-white/70">{beacon.user.name}</span> — {beacon.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#7C7C7C] font-medium">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {beacon.time}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#CF5C36]" /> {beacon.distance} away</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex sm:flex-col justify-end sm:justify-center mt-4 sm:mt-0 z-10">
                      {requestedIds.includes(beacon.id) ? (
                        <button disabled className="px-5 py-2.5 bg-white/5 text-[#7C7C7C] text-sm font-medium rounded-xl border border-white/5 cursor-not-allowed">
                          Requested
                        </button>
                      ) : (
                        <button onClick={() => setRequestingBeaconId(beacon.id)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10 transition-all active:scale-95">
                          Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {browseView === "map" && (
              <div className="relative w-full h-[65vh] bg-[#050505] rounded-[32px] border border-white/10 overflow-hidden flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] to-[#000000] animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {beacons.map((beacon) => (
                  <div key={beacon.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group" style={beacon.mapPos} onClick={() => setRequestingBeaconId(beacon.id)}>
                    <div className="relative w-32 h-32 bg-[#CF5C36]/10 rounded-full border border-[#CF5C36]/20 flex items-center justify-center animate-pulse group-hover:bg-[#CF5C36]/20 transition-all">
                      <img src={beacon.user.avatar} className="w-10 h-10 rounded-full border-2 border-[#CF5C36] opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <span className="font-semibold text-[#CF5C36]">{beacon.title}</span> • {beacon.distance} away
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#CF5C36] rounded-full animate-ping" />
                  <span className="text-xs text-[#7C7C7C] font-medium whitespace-nowrap">Radiuses show general area. Venue hidden.</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: INBOX (Requests & Active Chats) */}
        {activeTab === "inbox" && (
          <div className="animate-in fade-in duration-300 h-full">
            
            {/* List View (Shows if no specific chat is open) */}
            {!openedChatId ? (
              <div className="px-4 sm:px-6">
                
                {/* Inbox Toggle */}
                <div className="flex bg-[#0A0A0A] border border-white/10 rounded-2xl p-1 mb-8">
                  <button onClick={() => setInboxView("requests")} className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${inboxView === "requests" ? "bg-white/10 text-white shadow-sm" : "text-[#7C7C7C] hover:text-white"}`}>
                    Requests <span className="ml-1 px-1.5 py-0.5 bg-[#CF5C36] text-white text-[10px] rounded-md">{requests.length}</span>
                  </button>
                  <button onClick={() => setInboxView("active")} className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${inboxView === "active" ? "bg-white/10 text-white shadow-sm" : "text-[#7C7C7C] hover:text-white"}`}>
                    Active Vibes
                  </button>
                </div>

                {/* REQUESTS VIEW */}
                {inboxView === "requests" && (
                  <div className="flex flex-col gap-4">
                    {requests.length === 0 && (
                      <div className="text-center py-20 text-[#7C7C7C] text-sm italic">No pending requests.</div>
                    )}
                    {requests.map((req) => (
                      <div key={req.id} className="p-5 rounded-[24px] bg-[#0A0A0A] border border-white/10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img src={req.user.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                            <div>
                              <h3 className="font-medium text-white">{req.user.name}, {req.user.age}</h3>
                              <p className="text-xs text-[#7C7C7C]">Requested: {req.beaconTitle}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#7C7C7C] uppercase tracking-wider">{req.timeAgo}</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-5 relative">
                          <div className="absolute -top-2 left-6 w-4 h-4 bg-white/5 border-t border-l border-white/5 transform rotate-45" />
                          <p className="text-sm text-white/90 font-light leading-relaxed italic relative z-10">"{req.message}"</p>
                        </div>
                        {req.status === "pending" ? (
                          <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleDecline(req.id)} className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all"><Ban className="w-3.5 h-3.5" /> Decline</button>
                            <button onClick={() => handleHold(req.id)} className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#EFC88B]/10 text-[#EFC88B] border border-[#EFC88B]/20 hover:bg-[#EFC88B]/20 text-xs font-medium transition-all"><MessageCircle className="w-3.5 h-3.5" /> Hold</button>
                            <button onClick={() => handleAccept(req.id)} className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#CF5C36] text-white hover:bg-[#b04a29] text-xs font-medium transition-all"><Check className="w-3.5 h-3.5" /> Accept</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-1 pl-4 rounded-xl bg-[#EFC88B]/5 border border-[#EFC88B]/20">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#EFC88B] animate-pulse" />
                              <span className="text-xs font-medium text-[#EFC88B]">On Hold</span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { setInboxView("active"); setOpenedChatId(`c-${req.id}`); }} className="px-4 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all">Chat</button>
                              <button onClick={() => handleAccept(req.id)} className="px-4 h-8 rounded-lg bg-[#CF5C36] text-white hover:bg-[#b04a29] text-xs font-medium transition-all">Accept</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTIVE CHATS VIEW */}
                {inboxView === "active" && (
                  <div className="flex flex-col gap-3">
                    {activeChats.map((chat) => (
                      <div key={chat.id} onClick={() => setOpenedChatId(chat.id)} className="flex items-center gap-4 p-4 rounded-[24px] bg-[#0A0A0A] border border-white/10 hover:bg-[#111] cursor-pointer transition-all active:scale-[0.98]">
                        <img src={chat.user.avatar} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium text-white">{chat.user.name}</h3>
                            <span className="text-xs text-[#EFC88B] flex items-center gap-1"><Timer className="w-3 h-3"/> {chat.expiresIn}</span>
                          </div>
                          <p className="text-sm text-[#7C7C7C] truncate font-light">{chat.beaconTitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              
              /* ACTIVE CHAT UI (Full Screen) */
              <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col animate-in slide-in-from-right-8 duration-300">
                <header className="flex flex-col bg-black/80 backdrop-blur-xl border-b border-white/10 pt-safe">
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setOpenedChatId(null)} className="p-2 rounded-full hover:bg-white/10 transition-all"><ChevronLeft className="w-6 h-6 text-white" /></button>
                      <img src={activeChat?.user.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div>
                        <h3 className="font-medium text-white leading-tight">{activeChat?.user.name}</h3>
                        <p className="text-xs text-[#7C7C7C] truncate w-40 sm:w-auto">{activeChat?.beaconTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#CF5C36]/10 border border-[#CF5C36]/30 text-[#CF5C36] rounded-full text-xs font-medium">
                        <Timer className="w-3.5 h-3.5" /> {activeChat?.expiresIn}
                      </div>
                      <button className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/20"><AlertTriangle className="w-5 h-5" /></button>
                    </div>
                  </div>
                  {/* Location Reveal Block */}
                  <div className="w-full flex items-center justify-between px-4 pb-3 mt-1 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2 bg-[#CF5C36]/10 px-3 py-1.5 rounded-lg border border-[#CF5C36]/20">
                      <Navigation className="w-3.5 h-3.5 text-[#CF5C36]" />
                      <span className="text-xs font-medium text-white/90">
                        {activeChat?.location || "Exact Venue Revealed"}
                      </span>
                    </div>
                  </div>
                </header>
                <div className="sm:hidden flex items-center justify-center gap-1.5 py-2 bg-[#0A0A0A] border-b border-white/5 text-[#CF5C36] text-xs font-medium">
                  <Timer className="w-3.5 h-3.5" /> Self-destructs in {activeChat?.expiresIn}
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="text-center my-6">
                    <span className="text-xs font-medium text-[#7C7C7C] uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">Vibe Check Initiated</span>
                  </div>
                  {activeChat?.messages.map((msg: any) => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderId === "me" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[75%] px-5 py-3 rounded-2xl ${msg.senderId === "me" ? "bg-[#CF5C36] text-white rounded-tr-sm" : "bg-[#1A1A1A] border border-white/5 text-[#EEE5E9] rounded-tl-sm"}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-[#7C7C7C] mt-1.5 px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
                  <div className="relative flex items-center">
                    <input type="text" placeholder="Type a message..." className="w-full h-12 pl-5 pr-14 bg-[#111] border border-white/10 rounded-full focus:border-[#CF5C36]/50 outline-none transition-all text-sm text-white placeholder:text-[#7C7C7C]" />
                    <button className="absolute right-1.5 p-2 rounded-full bg-[#CF5C36] text-white hover:bg-[#b04a29] transition-all"><Send className="w-4 h-4 ml-0.5" /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRIPS */}
        {activeTab === "trips" && !openedChatId && (
           <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
             <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center mb-6"><Plane className="w-8 h-8 text-[#EFC88B]" /></div>
             <h2 className="text-2xl font-medium text-white mb-2">Noxu Trips</h2>
             <p className="text-[#7C7C7C] text-sm max-w-sm mx-auto">Curated group trips and spontaneous weekend getaways are dropping in Phase 2.</p>
           </div>
        )}
      </div>

      {/* Navigation Dock (Hidden when a chat is open) */}
      {!openedChatId && (
        <GlassDock className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-max justify-between sm:justify-center px-4 py-2 gap-2 sm:gap-6 z-40">
          <button onClick={() => setActiveTab("browse")} className={`flex flex-col items-center gap-1 p-2 sm:px-4 rounded-2xl transition-all ${activeTab === "browse" ? "text-white bg-white/10" : "text-[#7C7C7C] hover:text-white"}`}><Compass className="w-5 h-5" /><span className="text-[10px] font-medium">Browse</span></button>
          <button onClick={() => setActiveTab("inbox")} className={`flex flex-col items-center gap-1 p-2 sm:px-4 rounded-2xl transition-all ${activeTab === "inbox" ? "text-white bg-white/10 relative" : "text-[#7C7C7C] hover:text-white relative"}`}>
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-2 sm:right-3 w-2 h-2 bg-[#CF5C36] rounded-full border border-black" />
            <span className="text-[10px] font-medium">Inbox</span>
          </button>
          <button onClick={() => setActiveTab("trips")} className={`flex flex-col items-center gap-1 p-2 sm:px-4 rounded-2xl transition-all ${activeTab === "trips" ? "text-white bg-white/10" : "text-[#7C7C7C] hover:text-white"}`}><Plane className="w-5 h-5" /><span className="text-[10px] font-medium">Trips</span></button>
          <div className="w-[1px] h-8 bg-white/10 mx-2 hidden sm:block" />
          <button className="flex flex-col items-center gap-1 p-2 sm:px-4 rounded-2xl text-[#7C7C7C] hover:text-white"><Users className="w-5 h-5" /><span className="text-[10px] font-medium">Profile</span></button>
        </GlassDock>
      )}

      {/* SEND REQUEST MODAL (SENDER FLOW) */}
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
                  onClick={handleSendRequest}
                  disabled={!icebreaker.trim()}
                  className="w-full h-14 bg-[#CF5C36] hover:bg-[#b04a29] text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(207,92,54,0.4)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE ACTIVITY MODAL */}
      <AnimatePresence>
        {isPosting && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPosting(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%", scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: "100%", scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden">
              <button onClick={() => setIsPosting(false)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#7C7C7C] hover:text-white transition-all"><X className="w-5 h-5" /></button>
              <h2 className="text-2xl font-semibold text-white mb-6 tracking-tight">Post a Beacon</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-2 block">The Vibe</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CF5C36] hover:bg-[#CF5C36]/10 transition-all text-white/80 group"><Coffee className="w-6 h-6 group-hover:text-[#CF5C36]" /><span className="text-xs font-medium">Coffee</span></button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CF5C36] hover:bg-[#CF5C36]/10 transition-all text-white/80 group"><Utensils className="w-6 h-6 group-hover:text-[#CF5C36]" /><span className="text-xs font-medium">Dining</span></button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#CF5C36]/10 border border-[#CF5C36] text-white group"><Music className="w-6 h-6 text-[#CF5C36]" /><span className="text-xs font-medium">Culture</span></button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-2 block">Activity Title</label>
                  <input type="text" placeholder="e.g. Extra ticket for The Batman" className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#CF5C36] text-sm text-white placeholder:text-[#7C7C7C] outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider mb-2 block">Venue (Public Only)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C7C7C]" />
                    <input type="text" placeholder="Search Google Places..." className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl focus:border-[#CF5C36] text-sm text-white placeholder:text-[#7C7C7C] outline-none transition-all" />
                  </div>
                </div>
                <button onClick={() => setIsPosting(false)} className="w-full mt-4 h-14 bg-[#CF5C36] hover:bg-[#b04a29] text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(207,92,54,0.4)]">
                  Broadcast to Nearby
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}