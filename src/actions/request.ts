"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { Request } from "@/lib/db/models/Request";
import { Beacon } from "@/lib/db/models/Beacon";
import { User } from "@/lib/db/models/User";
import { Chat } from "@/lib/db/models/Chat"; 
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

/**
 * 1. Sends a vibe check (request) to a specific beacon
 */
/**
 * 1. Sends a vibe check (request) to a specific beacon
 */
export async function sendRequestAction(beaconId: string, message: string) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    // 1. Fetch the beacon
    const targetBeacon = await Beacon.findById(beaconId);
    
    // BUG FIX: Prevent crash if the beacon was already deleted or expired
    if (!targetBeacon) {
      return { success: false, error: "This vibe is no longer active or was deleted." };
    }

    if (targetBeacon.hostId.toString() === userId) {
      return { success: false, error: "You cannot request your own beacon." };
    }

    // 2. Create the request
    await Request.create({
      beaconId,
      senderId: userId,
      message,
      status: "pending",
    });

    // 3. Send real-time ping to the host
    const hostId = targetBeacon.hostId.toString();
    await pusherServer.trigger(`user-${hostId}`, "new-request", {
      message: "You have a new vibe request!"
    });

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error sending request:", error);
    
    // Check for duplicate request error
    if (error.code === 11000) {
      return { success: false, error: "You have already requested to join this vibe." };
    }
    
    // BUG FIX: Pass the ACTUAL database error to the frontend so we can see it in the alert box
    return { 
      success: false, 
      error: error.message || "Server error: Failed to send request." 
    };
  }
}

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
      status: { $in: ["pending", "hold"] } 
    })
    .populate({ path: "senderId", model: User, select: "name age avatar" })
    .populate({ path: "beaconId", model: Beacon, select: "title" })
    .sort({ createdAt: -1 })
    .lean();

const formattedRequests = pendingRequests.map((req: any) => ({
      id: req._id.toString(),
      user: {
        id: req.senderId?._id?.toString(), // <--- THIS IS THE MAGIC FIX!
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

export async function declineRequestAction(requestId: string) {
  try {
    await connectToDatabase();
    await Request.findByIdAndDelete(requestId);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

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
 * 5. Handles Action: Accept (Creates the Chat & Includes Initial Message to fix Race Condition)
 */
/**
 * 5. Handles Action: Accept (Creates Chat, Passes Timer, and Auto-Kills Full Beacons)
 */
/**
 * 5. Handles Action: Accept (Creates Chat, Passes Timer, and Auto-Kills Full Beacons)
 */
export async function acceptRequestAction(requestId: string, initialMessage?: string) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const req = await Request.findById(requestId).populate("beaconId");
    if (!req) return { success: false, error: "Request not found" };

    // 1. Mark request as accepted
    req.status = "accepted";
    await req.save();

    // 2. Fetch the actual Beacon to update its capacity
    const targetBeacon = await Beacon.findById(req.beaconId._id);
    if (!targetBeacon) return { success: false, error: "Beacon no longer exists" };

    // 3. FIX: Safely increment joinedCount (protects against older test beacons)
    targetBeacon.joinedCount = (targetBeacon.joinedCount || 0) + 1;
    const capacity = targetBeacon.capacity || 1;

    // 4. FIX: Use "filled" instead of "full" to perfectly match your Mongoose schema!
    if (targetBeacon.joinedCount >= capacity) {
      targetBeacon.status = "filled";
    }
    await targetBeacon.save();

    // 5. Setup the initial messages array
    const messagesArray = [{
      senderId: req.senderId,
      text: req.message,
      timestamp: new Date()
    }];

    if (initialMessage) {
      messagesArray.push({
        senderId: userId,
        text: initialMessage,
        timestamp: new Date()
      });
    }

    // 6. Create the Chat and inherit the Beacon's self-destruct timer
    const newChat = await Chat.create({
      beaconId: targetBeacon._id,
      participants: [userId, req.senderId], 
      expiresAt: targetBeacon.expiresAt, 
      messages: messagesArray
    });

    // Notify the sender they were accepted
    await pusherServer.trigger(`user-${req.senderId.toString()}`, "request-accepted", {
      chatId: newChat._id.toString()
    });

    return { success: true, chatId: newChat._id.toString() };
  } catch (error: any) {
    console.error("Error accepting request:", error);
    // Pass actual DB error to frontend if it fails again
    return { success: false, error: error.message || "Failed to accept request." };
  }
}