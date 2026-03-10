"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { Chat } from "@/lib/db/models/Chat";
import { User } from "@/lib/db/models/User";
import { Beacon } from "@/lib/db/models/Beacon";

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

    // Register models just in case (Next.js hot-reload fix)
    if (!User) console.log("Registering User");
    if (!Beacon) console.log("Registering Beacon");

    // Find all chats where this user is one of the participants
    const activeChats = await Chat.find({ participants: userId })
      .populate({ path: "participants", model: User, select: "name avatar" })
      .populate({ path: "beaconId", model: Beacon, select: "title venueName" })
      .sort({ createdAt: -1 })
      .lean();

    const formattedChats = activeChats.map((chat: any) => {
      // Figure out who the "other" person is so we can display their name/avatar
      const otherUser = chat.participants.find((p: any) => p._id.toString() !== userId) || chat.participants[0];

      return {
        id: chat._id.toString(),
        user: {
          name: otherUser?.name || "Unknown",
          avatar: otherUser?.avatar || "",
        },
        beaconTitle: chat.beaconId?.title || "Unknown Activity",
        location: chat.beaconId?.venueName || "Secret Venue",
        expiresIn: "Active Now", // Real timer can be calculated later
        messages: chat.messages.map((msg: any, index: number) => ({
          id: `m-${index}`,
          senderId: msg.senderId.toString() === userId ? "me" : "them",
          text: msg.text,
          // Format time as "8:05 PM"
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

/**
 * Pushes a new text message into an existing chat room
 */
export async function sendMessageAction(chatId: string, text: string) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const chat = await Chat.findById(chatId);
    if (!chat) return { success: false, error: "Chat not found" };

    // Push the new message into the MongoDB array
    chat.messages.push({
      senderId: userId,
      text: text,
      timestamp: new Date()
    });

    await chat.save();
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}