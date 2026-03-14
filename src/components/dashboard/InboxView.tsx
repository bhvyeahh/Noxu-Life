"use client";

import React, { useState, useEffect, useRef } from "react";
import PusherClient from "pusher-js";
import { Timer, AlertTriangle, Send, ChevronLeft, Check, MessageCircle, Ban, Navigation, Loader2, Inbox, Sparkles } from "lucide-react";

interface InboxProps {
  inboxView: "requests" | "active";
  setInboxView: (view: "requests" | "active") => void;
  requests: any[];
  activeChats: any[];
  openedChatId: string | null;
  setOpenedChatId: (id: string | null) => void;
  handleAccept: (id: string) => void;
  handleHold: (id: string) => void;
  handleDecline: (id: string) => void;
  activeChat: any;
  handleSendMessage: (chatId: string, text: string) => void;
}

export function InboxView({
  inboxView, setInboxView, requests, activeChats,
  openedChatId, setOpenedChatId, handleAccept, handleHold, handleDecline, activeChat,
  handleSendMessage
}: InboxProps) {
  
  const [messageText, setMessageText] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // NEW: Live Timer Engine
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Tick every second to update the real-time countdowns
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format the backend timestamp into a clean HH:MM:SS format
  const formatTimeLeft = (expiresAt: string | undefined | null) => {
    if (!expiresAt) return "";
    // If it's a "Hold" request, or an old fallback string, return it as is
    if (expiresAt === "Hold" || expiresAt === "Active Now") return expiresAt;

    const targetTime = new Date(expiresAt).getTime();
    if (isNaN(targetTime)) return expiresAt;

    const diff = targetTime - now;
    if (diff <= 0) return "00:00:00"; // Time's up

    const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    if (activeChat?.messages) {
      setLiveMessages(activeChat.messages);
    } else {
      setLiveMessages([]);
    }
  }, [activeChat]);

  useEffect(() => {
    if (!openedChatId) return;
    
    const actualChatId = openedChatId.startsWith('c-') ? openedChatId.slice(2) : openedChatId;

    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${actualChatId}`);

    channel.bind("new-message", (incoming: any) => {
      setLiveMessages((prev) => {
        const isOptimistic = prev.some(m => m.id.toString().startsWith('temp-') && m.text === incoming.text);
        if (isOptimistic) {
          return prev.map(m => 
            (m.id.toString().startsWith('temp-') && m.text === incoming.text) 
              ? { ...m, id: incoming.id } 
              : m
          );
        }
        if (prev.some(m => m.id === incoming.id)) return prev;

        return [...prev, {
          id: incoming.id,
          senderId: "them", 
          text: incoming.text,
          timestamp: incoming.timestamp
        }];
      });
    });

    return () => {
      pusher.unsubscribe(`chat-${actualChatId}`);
      pusher.disconnect();
    };
  }, [openedChatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveMessages, openedChatId]);

  const onSend = async () => {
    if (!messageText.trim() || !openedChatId) return;
    
    setIsSendingMsg(true);
    const tempText = messageText.trim();
    setMessageText(""); 
    
    const tempMsg = {
      id: `temp-${Date.now()}`,
      senderId: "me",
      text: tempText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLiveMessages((prev) => [...prev, tempMsg]);

    const actualChatId = openedChatId.startsWith('c-') ? openedChatId.slice(2) : openedChatId;
    await handleSendMessage(actualChatId, tempText);
    
    setIsSendingMsg(false);
  };

  return (
    <div className="animate-in fade-in duration-300 h-full font-sans">
      {!openedChatId ? (
        <div className="px-4 sm:px-6 pb-6">
          
          <div className="relative flex bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 mb-8 shadow-inner supports-[backdrop-filter]:bg-black/40">
            <button 
              onClick={() => setInboxView("requests")} 
              className={`relative flex-1 h-10 rounded-full text-sm font-semibold transition-all duration-300 z-10 flex items-center justify-center gap-2 ${inboxView === "requests" ? "text-white bg-white/10 shadow-md" : "text-[#7C7C7C] hover:text-white"}`}
            >
              Requests 
              {requests.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${inboxView === "requests" ? "bg-[#CF5C36] text-white shadow-[0_0_10px_rgba(207,92,54,0.5)]" : "bg-white/10 text-[#7C7C7C]"}`}>
                  {requests.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setInboxView("active")} 
              className={`relative flex-1 h-10 rounded-full text-sm font-semibold transition-all duration-300 z-10 ${inboxView === "active" ? "text-white bg-white/10 shadow-md" : "text-[#7C7C7C] hover:text-white"}`}
            >
              Active Vibes
            </button>
          </div>

          {inboxView === "requests" && (
            <div className="flex flex-col gap-5">
              {requests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 px-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <Inbox className="w-8 h-8 text-[#7C7C7C]/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Inbox Zero</h3>
                  <p className="text-[#7C7C7C] text-sm text-center max-w-xs leading-relaxed">You have no pending requests. Broadcast a new vibe to get the party started.</p>
                </div>
              )}
              
              {requests.map((req) => (
                <div key={req.id} className="p-6 rounded-[32px] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#CF5C36]/5">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={req.user.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-[#111] shadow-lg" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white tracking-tight">{req.user.name}, {req.user.age}</h3>
                        <p className="text-xs text-[#7C7C7C] mt-0.5 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#CF5C36]" /> {req.beaconTitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#7C7C7C] font-semibold uppercase tracking-widest">{req.timeAgo}</span>
                  </div>
                  
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 mb-6 relative shadow-inner">
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-black/40 border-t border-l border-white/5 transform rotate-45" />
                    <p className="text-sm text-white/90 font-light leading-relaxed italic relative z-10">"{req.message}"</p>
                  </div>
                  
                  {req.status === "pending" ? (
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => handleDecline(req.id)} className="group flex items-center justify-center gap-1.5 h-12 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all duration-300">
                        <Ban className="w-4 h-4 transition-transform group-hover:scale-110" /> Decline
                      </button>
                      <button onClick={() => handleHold(req.id)} className="group flex items-center justify-center gap-1.5 h-12 rounded-2xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white text-xs font-semibold transition-all duration-300">
                        <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" /> Hold
                      </button>
                      <button onClick={() => handleAccept(req.id)} className="group flex items-center justify-center gap-1.5 h-12 rounded-2xl bg-gradient-to-b from-[#CF5C36] to-[#b04a29] text-white hover:from-[#E36940] hover:to-[#CF5C36] shadow-[0_4px_15px_rgba(207,92,54,0.3)] text-xs font-semibold transition-all duration-300">
                        <Check className="w-4 h-4 transition-transform group-hover:scale-110" /> Accept
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 pl-5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#7C7C7C] animate-pulse" />
                        <span className="text-xs font-semibold text-white/70">On Hold</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setInboxView("active"); setOpenedChatId(`c-${req.id}`); }} className="px-5 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all">Chat</button>
                        <button onClick={() => handleAccept(req.id)} className="px-5 h-10 rounded-xl bg-[#CF5C36] text-white hover:bg-[#b04a29] text-xs font-semibold transition-all shadow-md">Accept</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {inboxView === "active" && (
            <div className="flex flex-col gap-3">
              {activeChats.length === 0 && (
                <div className="text-center py-20 text-[#7C7C7C] text-sm italic">No active chats.</div>
              )}
              {activeChats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setOpenedChatId(chat.id)} 
                  className="group flex items-center gap-4 p-4 rounded-[28px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer transition-all duration-300 active:scale-[0.98]"
                >
                  <img src={chat.user.avatar} className="w-16 h-16 rounded-full object-cover border border-white/10 shadow-md group-hover:border-white/20 transition-colors" />
                  <div className="flex-1 overflow-hidden pr-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <h3 className="font-semibold text-white text-base tracking-tight">{chat.user.name}</h3>
                      <span className="text-[11px] font-mono text-[#CF5C36] flex items-center gap-1 bg-[#CF5C36]/10 px-2 py-0.5 rounded-full border border-[#CF5C36]/20">
                        <Timer className="w-3 h-3"/> {formatTimeLeft(chat.expiresIn)}
                      </span>
                    </div>
                    <p className="text-sm text-[#7C7C7C] truncate font-light tracking-wide">{chat.beaconTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col animate-in slide-in-from-right-8 duration-300">
          
          <header className="flex flex-col bg-black/40 backdrop-blur-2xl border-b border-white/[0.08] pt-safe supports-[backdrop-filter]:bg-black/20 z-10">
            <div className="flex items-center justify-between px-2 py-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setOpenedChatId(null)} className="p-2 rounded-full hover:bg-white/10 transition-all text-white/80 hover:text-white">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                  <img src={activeChat?.user.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-sm" />
                  <div>
                    <h3 className="font-semibold text-white leading-tight">{activeChat?.user.name}</h3>
                    <p className="text-xs text-[#7C7C7C] truncate w-40 sm:w-auto font-medium">{activeChat?.beaconTitle}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pr-4">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#CF5C36]/10 border border-[#CF5C36]/20 text-[#CF5C36] rounded-full text-xs font-mono font-semibold shadow-inner">
                  <Timer className="w-3.5 h-3.5" /> {formatTimeLeft(activeChat?.expiresIn)}
                </div>
                <button className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/10 hover:border-red-500/30">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="w-full flex items-center justify-center px-4 pb-3">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm">
                <Navigation className="w-3.5 h-3.5 text-white/70" />
                <span className="text-xs font-medium text-white/90 tracking-wide">{activeChat?.location || "Exact Venue Revealed"}</span>
              </div>
            </div>
          </header>

          <div className="sm:hidden flex items-center justify-center gap-1.5 py-1.5 bg-[#CF5C36]/10 border-b border-[#CF5C36]/20 text-[#CF5C36] text-[10px] font-mono font-bold tracking-widest uppercase">
            <Timer className="w-3.5 h-3.5" /> Self-destructs in {formatTimeLeft(activeChat?.expiresIn)}
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-transparent to-[#111111]/30">
            <div className="text-center my-6">
              <span className="text-[10px] font-bold text-[#7C7C7C] uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-sm">
                Vibe Check Initiated
              </span>
            </div>
            {liveMessages.map((msg: any) => (
              <div key={msg.id} className={`flex flex-col ${msg.senderId === "me" ? "items-end" : "items-start"}`}>
                <div 
                  className={`max-w-[75%] px-5 py-3 rounded-[24px] shadow-md ${
                    msg.senderId === "me" 
                      ? "bg-gradient-to-br from-[#CF5C36] to-[#b04a29] text-white rounded-br-sm shadow-[#CF5C36]/20" 
                      : "bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 text-[#EEE5E9] rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] font-medium text-[#7C7C7C] mt-1.5 px-2">{msg.timestamp}</span>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-black/40 backdrop-blur-2xl border-t border-white/[0.08] pb-safe supports-[backdrop-filter]:bg-black/20">
            <div className="relative flex items-center max-w-3xl mx-auto">
              <input 
                type="text" 
                placeholder="Message..." 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSend();
                  }
                }}
                className="w-full h-12 pl-6 pr-14 bg-white/5 border border-white/10 hover:border-white/20 rounded-full focus:border-[#CF5C36]/50 focus:bg-white/10 outline-none transition-all duration-300 text-sm text-white placeholder:text-[#7C7C7C] shadow-inner" 
              />
              <button 
                onClick={onSend}
                disabled={!messageText.trim() || isSendingMsg}
                className="absolute right-1.5 w-9 h-9 rounded-full bg-[#CF5C36] text-white hover:bg-[#b04a29] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center shadow-lg shadow-[#CF5C36]/30"
              >
                {isSendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}