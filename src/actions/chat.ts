"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { Chat } from "@/lib/db/models/Chat";
import { User } from "@/lib/db/models/User";
import { Beacon } from "@/lib/db/models/Beacon";
import { pusherServer } from "@/lib/pusher";

async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("noxu_session")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export async function getActiveChatsAction() {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, chats: [] };

    if (!User) console.log("Registering User");
    if (!Beacon) console.log("Registering Beacon");

    // Fetch chats
    const activeChats = await Chat.find({ participants: userId })
      .populate({ path: "participants", model: User, select: "name avatar" })
      .populate({ path: "beaconId", model: Beacon, select: "title venueName expiresAt" })
      .lean();

    // Sort chats so the one with the newest message is ALWAYS at the top
    activeChats.sort((a: any, b: any) => {
      const lastMsgA = a.messages?.length > 0 ? new Date(a.messages[a.messages.length - 1].timestamp).getTime() : new Date(a.createdAt || 0).getTime();
      const lastMsgB = b.messages?.length > 0 ? new Date(b.messages[b.messages.length - 1].timestamp).getTime() : new Date(b.createdAt || 0).getTime();
      return lastMsgB - lastMsgA;
    });

    const formattedChats = activeChats.map((chat: any) => {
      const otherUser = chat.participants.find((p: any) => p._id.toString() !== userId) || chat.participants[0];
      
      // Get exact expiration time from the chat or the parent beacon
      const exactExpiresAt = chat.expiresAt || chat.beaconId?.expiresAt;

      return {
        id: chat._id.toString(),
        user: {
          name: otherUser?.name || "Unknown",
          avatar: otherUser?.avatar || "",
        },
        beaconTitle: chat.beaconId?.title || "Unknown Activity",
        location: chat.beaconId?.venueName || "Secret Venue",
        // Send the real ISO string timestamp to the frontend
        expiresIn: exactExpiresAt ? new Date(exactExpiresAt).toISOString() : "Active Now", 
        messages: chat.messages.map((msg: any, index: number) => ({
          id: msg._id ? msg._id.toString() : `m-${index}`,
          senderId: msg.senderId.toString() === userId ? "me" : "them",
          rawSenderId: msg.senderId.toString(), 
          text: msg.text,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      };
    });

    return { success: true, chats: formattedChats };
  } catch (error) {
    console.error("Error fetching chats:", error);
    return { success: false, chats: [] };
  }
}

export async function sendMessageAction(chatId: string, text: string) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const chat = await Chat.findById(chatId);
    if (!chat) return { success: false, error: "Chat not found" };

    const newMessage = {
      senderId: userId,
      text: text,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    const formattedTimestamp = newMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Trigger the specific chat room
    await pusherServer.trigger(`chat-${chatId}`, "new-message", {
      id: `m-${chat.messages.length - 1}`, 
      rawSenderId: userId, 
      text: text,
      timestamp: formattedTimestamp
    });

    // 2. Trigger the OTHER user's personal global channel
    const otherParticipantId = chat.participants.find((p: any) => p.toString() !== userId)?.toString();
    if (otherParticipantId) {
      await pusherServer.trigger(`user-${otherParticipantId}`, "chat-updated", { chatId });
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}