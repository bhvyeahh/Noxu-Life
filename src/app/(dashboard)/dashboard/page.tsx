"use client";

import React, { useState, useEffect } from "react";
import PusherClient from "pusher-js";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardDock } from "@/components/dashboard/DashboardDock";
import { BrowseView } from "@/components/dashboard/BrowseView";
import { InboxView } from "@/components/dashboard/InboxView";
import { TripsView } from "@/components/dashboard/TripsView";
import { ActivityModals } from "@/components/dashboard/ActivityModals";
import { getActiveBeaconsAction } from "@/actions/beacon";
import {
  getPendingRequestsAction,
  acceptRequestAction,
  holdRequestAction,
  declineRequestAction,
} from "@/actions/request";
import { getActiveChatsAction, sendMessageAction } from "@/actions/chat";
import { getCurrentUserAction } from "@/actions/user";

type Tab = "browse" | "inbox" | "trips";
type InboxViewType = "requests" | "active";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [browseView, setBrowseView] = useState<"list" | "map">("list");
  const [inboxView, setInboxView] = useState<InboxViewType>("requests");

  const [beacons, setBeacons] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | undefined>(undefined);

  const [requests, setRequests] = useState<any[]>([]);
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  const [isPosting, setIsPosting] = useState(false);
  const [openedChatId, setOpenedChatId] = useState<string | null>(null);
  const [requestingBeaconId, setRequestingBeaconId] = useState<string | null>(null);
  const [icebreaker, setIcebreaker] = useState("");

  const fetchBeacons = async (lat?: number, lng?: number) => {
    setIsLoadingFeed(true);
    try {
      const fetchLat = lat ?? userLoc?.lat;
      const fetchLng = lng ?? userLoc?.lng;
      const res = await getActiveBeaconsAction(fetchLat, fetchLng);
      if (res.success) {
        setBeacons(res.beacons || []);
      } else {
        setBeacons([]);
      }
    } catch (e) {
      setBeacons([]);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const fetchCurrentUser = async () => {
    const res = await getCurrentUserAction();
    if (res.success) setCurrentUser(res.user);
  };

  const fetchInbox = async () => {
    const res = await getPendingRequestsAction();
    if (res.success) setRequests(res.requests || []);
  };

  const fetchChats = async () => {
    const res = await getActiveChatsAction();
    if (res.success) setActiveChats(res.chats || []);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchInbox();
    fetchChats();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLoc({ lat, lng });
          fetchBeacons(lat, lng); 
        },
        (error) => {
          console.warn("Location access denied or failed. Fetching global feed.");
          fetchBeacons(); 
        },
        { timeout: 5000 } 
      );
    } else {
      fetchBeacons();
    }
  }, []);

  // 2. THE GLOBAL LISTENER
  useEffect(() => {
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;

    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`user-${userId}`);
    
    // Listeners for global updates
    channel.bind("new-request", () => fetchInbox());
    channel.bind("request-accepted", () => fetchChats());
    
    // FIXED: This forces the app to update the active chats list (and re-sort it)
    // whenever ANY message is received in ANY chat you are a part of.
    channel.bind("chat-updated", () => fetchChats());

    return () => {
      pusher.unsubscribe(`user-${userId}`);
      pusher.disconnect();
    };
  }, [currentUser]);

  const handleSendRequest = () => {
    if (requestingBeaconId) {
      setRequestedIds([...requestedIds, requestingBeaconId]);
      setRequestingBeaconId(null);
      setIcebreaker("");
    }
  };

  const handleAccept = async (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    const res = await acceptRequestAction(requestId);

    if (res.success) {
      setInboxView("active");
      fetchChats();
    } else {
      alert(res.error || "Failed to accept request");
      fetchInbox();
    }
  };

  const handleHold = async (requestId: string) => {
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "hold" } : r)));
    await holdRequestAction(requestId);
  };

  const handleDecline = async (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    await declineRequestAction(requestId);
  };

  const handleSendMessage = async (targetId: string, text: string) => {
    const isRequest = requests.some((r) => r.id === targetId);

    if (isRequest) {
      const acceptRes = await acceptRequestAction(targetId, text);
      
      if (acceptRes.success && acceptRes.chatId) {
        setRequests(requests.filter((r) => r.id !== targetId));
        await fetchChats(); 
        setOpenedChatId(acceptRes.chatId);
        setInboxView("active");
      } else {
        alert("Failed to initiate chat.");
      }
    } else {
      const res = await sendMessageAction(targetId, text);
      if (res.success) {
        fetchChats();
      } else {
        alert("Failed to send message");
      }
    }
  };

  let activeChat = activeChats.find((c) => c.id === openedChatId);

  if (!activeChat && openedChatId?.startsWith("c-")) {
    const reqId = openedChatId.replace("c-", "");
    const req = requests.find((r) => r.id === reqId);
    
    if (req) {
      activeChat = {
        id: openedChatId,
        user: req.user,
        beaconTitle: req.beaconTitle,
        location: "Pending Acceptance",
        expiresIn: "Hold",
        messages: [
          {
            id: `msg-${req.id}`,
            senderId: "them",
            text: req.message,
            timestamp: req.timeAgo,
          }
        ],
      };
    }
  }

  return (
    <main className="relative min-h-screen bg-[#000000] text-[#EEE5E9] selection:bg-[#CF5C36] selection:text-white pb-32 font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#CF5C36]/5 via-[#CF5C36]/[0.02] to-transparent pointer-events-none" />

      {!openedChatId && (
        <DashboardHeader onPostClick={() => setIsPosting(true)} user={currentUser} />
      )}

      <div className="relative z-10 max-w-3xl mx-auto pt-6 px-4 sm:px-6">
        {activeTab === "browse" &&
          !openedChatId &&
          (isLoadingFeed ? (
            <div className="flex flex-col justify-center items-center h-64 gap-5 animate-in fade-in duration-500">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-[#CF5C36] rounded-full animate-spin" />
              </div>
              <p className="text-sm text-[#7C7C7C] font-medium tracking-widest uppercase animate-pulse">
                Scanning Area
              </p>
            </div>
          ) : beacons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 px-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative w-20 h-20 mb-8 flex items-center justify-center rounded-full bg-[#111111] border border-white/5 shadow-[0_0_40px_rgba(207,92,54,0.05)]">
                <div className="absolute w-full h-full rounded-full border border-[#CF5C36]/20 animate-ping opacity-20" />
                <div className="absolute w-8 h-8 rounded-full border border-[#CF5C36]/40 animate-ping opacity-40 delay-150" />
                <div className="w-3 h-3 bg-[#CF5C36] rounded-full shadow-[0_0_15px_rgba(207,92,54,0.8)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight text-center">
                It's quiet around here.
              </h3>
              <p className="text-[#7C7C7C] text-sm text-center max-w-sm mb-8 leading-relaxed">
                No active vibes found in your immediate radius. Be the pioneer and start something right now.
              </p>
              <button
                onClick={() => setIsPosting(true)}
                className="group relative px-6 py-3 bg-white/5 hover:bg-[#CF5C36]/10 border border-white/10 hover:border-[#CF5C36]/30 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(207,92,54,0.15)]"
              >
                <span className="relative z-10">Broadcast a Vibe</span>
              </button>
            </div>
          ) : (
            <BrowseView
              browseView={browseView}
              setBrowseView={setBrowseView}
              beacons={beacons}
              requestedIds={requestedIds}
              setRequestingBeaconId={setRequestingBeaconId}
            />
          ))}

        {activeTab === "inbox" && (
          <InboxView
            inboxView={inboxView}
            setInboxView={setInboxView}
            requests={requests}
            activeChats={activeChats}
            openedChatId={openedChatId}
            setOpenedChatId={setOpenedChatId}
            handleAccept={handleAccept}
            handleHold={handleHold}
            handleDecline={handleDecline}
            activeChat={activeChat}
            handleSendMessage={handleSendMessage}
          />
        )}

        {activeTab === "trips" && !openedChatId && <TripsView />}
      </div>

      {!openedChatId && (
        <DashboardDock activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <ActivityModals
        isPosting={isPosting}
        setIsPosting={setIsPosting}
        requestingBeaconId={requestingBeaconId}
        setRequestingBeaconId={setRequestingBeaconId}
        icebreaker={icebreaker}
        setIcebreaker={setIcebreaker}
        handleSendRequest={handleSendRequest}
        onSuccess={() => fetchBeacons(userLoc?.lat, userLoc?.lng)} 
      />
    </main>
  );
}