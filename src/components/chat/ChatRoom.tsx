"use client";

import React, { useState, useEffect, useRef } from "react";
import PusherClient from "pusher-js";
import { sendMessageAction } from "@/actions/chat"; // Aligned Import

// Aligned payload to match exactly what the backend broadcasts
interface MessagePayload {
  id: string;
  rawSenderId: string;
  text: string;
  timestamp: string;
}

export function ChatRoom({ chatId, currentUserId }: { chatId: string, currentUserId: string }) {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initialize Pusher Client
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // 2. Subscribe to this specific chat room's channel
    const channel = pusher.subscribe(`chat-${chatId}`);

    // 3. Listen for the 'new-message' event we defined in our Server Action
    channel.bind("new-message", (incomingMessage: MessagePayload) => {
      setMessages((prev) => {
        // Prevent duplicate messages if Pusher fires twice in rapid succession
        if (prev.some((msg) => msg.id === incomingMessage.id)) return prev;
        return [...prev, incomingMessage];
      });
    });

    // 4. Cleanup function
    return () => {
      pusher.unsubscribe(`chat-${chatId}`);
      pusher.disconnect();
    };
  }, [chatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const tempText = inputText;
    setInputText(""); // Instantly clear input for snappy UX

    // Fire the server action - Server securely gets currentUserId from cookies, so we don't pass it here
    await sendMessageAction(chatId, tempText);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-xl">
      
      {/* Header */}
      <div className="p-4 border-b border-white/[0.05] bg-black/20 flex justify-between items-center">
        <h3 className="text-white font-bold tracking-tight">Vibe Check</h3>
        <span className="text-xs text-[#CF5C36] font-mono bg-[#CF5C36]/10 px-2 py-1 rounded-full border border-[#CF5C36]/20">
          23:59:59
        </span>
      </div>

      {/* Message Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => {
          // Compare the rawSenderId from Pusher to the user's current ID
          const isMe = msg.rawSenderId === currentUserId;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div 
                className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
                  isMe 
                    ? "bg-gradient-to-r from-[#CF5C36] to-[#E36940] text-white rounded-br-sm shadow-md" 
                    : "bg-white/[0.05] text-white/90 border border-white/[0.05] rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-white/30 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/[0.05]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a vibe..."
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[#EFC88B]/50 transition-colors placeholder:text-white/30"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="absolute right-2 w-8 h-8 rounded-full bg-[#EFC88B]/20 text-[#EFC88B] flex items-center justify-center hover:bg-[#EFC88B] hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-[#EFC88B]/20 disabled:hover:text-[#EFC88B]"
          >
            ↑
          </button>
        </div>
      </form>

    </div>
  );
}