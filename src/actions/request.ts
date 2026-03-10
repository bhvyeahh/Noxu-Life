"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { Request } from "@/lib/db/models/Request";
import { Beacon } from "@/lib/db/models/Beacon";
import { User } from "@/lib/db/models/User";
import { Chat } from "@/lib/db/models/Chat"; // We will create chats here!

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

/**
 * 1. Sends a vibe check (request) to a specific beacon
 */
export async function sendRequestAction(beaconId: string, message: string) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const targetBeacon = await Beacon.findById(beaconId);
    if (targetBeacon.hostId.toString() === userId) {
      return { success: false, error: "You cannot request your own beacon." };
    }

    await Request.create({
      beaconId,
      senderId: userId,
      message,
      status: "pending",
    });

    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) return { success: false, error: "You have already requested to join this vibe." };
    console.error("Error sending request:", error);
    return { success: false, error: "Failed to send request." };
  }
}

/**
 * 2. Fetches requests for the logged-in user's beacons
 */
export async function getPendingRequestsAction() {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, requests: [] };

    const myBeacons = await Beacon.find({ hostId: userId, status: "active" }).select('_id');
    const myBeaconIds = myBeacons.map(b => b._id);

    if (!User) console.log("Registering User model..."); 
    
    const pendingRequests = await Request.find({ 
      beaconId: { $in: myBeaconIds },
      status: { $in: ["pending", "hold"] } // Fetch both pending and held
    })
    .populate({ path: "senderId", model: User, select: "name age avatar" })
    .populate({ path: "beaconId", model: Beacon, select: "title" })
    .sort({ createdAt: -1 })
    .lean();

    const formattedRequests = pendingRequests.map((req: any) => ({
      id: req._id.toString(),
      user: {
        name: req.senderId?.name || "Unknown",
        age: req.senderId?.age || 0,
        avatar: req.senderId?.avatar || "",
      },
      beaconTitle: req.beaconId?.title || "Unknown Beacon",
      message: req.message,
      status: req.status,
      timeAgo: "Just now", 
    }));

    return { success: true, requests: formattedRequests };
  } catch (error) {
    console.error("Error fetching inbox:", error);
    return { success: false, requests: [] };
  }
}

/**
 * 3. Handles Action: Decline
 */
export async function declineRequestAction(requestId: string) {
  try {
    await connectToDatabase();
    // We physically delete declined requests to keep the DB clean
    await Request.findByIdAndDelete(requestId);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * 4. Handles Action: Hold
 */
export async function holdRequestAction(requestId: string) {
  try {
    await connectToDatabase();
    await Request.findByIdAndUpdate(requestId, { status: "hold" });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * 5. Handles Action: Accept (Creates the Chat & Reveals Location)
 */
export async function acceptRequestAction(requestId: string) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const req = await Request.findById(requestId).populate("beaconId");
    if (!req) return { success: false, error: "Request not found" };

    // Update request status
    req.status = "accepted";
    await req.save();

    // CREATE THE CHAT ROOM
    const newChat = await Chat.create({
      beaconId: req.beaconId._id,
      participants: [userId, req.senderId], // The Host and the Requester
      expiresAt: req.beaconId.expiresAt, // Chat dies exactly when the beacon dies
      messages: [{
        senderId: req.senderId,
        text: req.message, // Port their icebreaker into the chat as the first message!
        timestamp: new Date()
      }]
    });

    return { success: true, chatId: newChat._id.toString() };
  } catch (error) {
    console.error("Error accepting request:", error);
    return { success: false, error: "Failed to accept request." };
  }
}