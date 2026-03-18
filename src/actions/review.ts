"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Chat } from "@/lib/db/models/Chat";
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

interface ReviewPayload {
  targetUserId: string;
  didShowUp: boolean; // Question 1
  safety?: number;    // 1-5
  punctuality?: number; // 1-5
  authenticity?: number; // 1-5
  badge?: "trustworthy" | "entertainer" | "punctual" | "none";
  role: "host" | "guest"; // To know which count to increment
}

export async function getReviewTargetAction(chatId: string) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const chat = await Chat.findById(chatId).populate("beaconId");
    if (!chat) return { success: false, error: "Chat not found" };

    // Find the OTHER participant in the chat
    const targetUserId = chat.participants.find((p: any) => p.toString() !== userId)?.toString();
    if (!targetUserId) return { success: false, error: "Target user not found" };

    const targetUser = await User.findById(targetUserId).select("name avatar");

    // ALGORITHM LOGIC: Determine their role. 
    // If the target user created the beacon, they are the "host". Otherwise, they are the "guest".
    const targetRole = chat.beaconId.hostId.toString() === targetUserId ? "host" : "guest";

    return {
      success: true,
      targetUserId,
      targetName: targetUser.name,
      targetAvatar: targetUser.avatar,
      targetRole
    };
  } catch (error) {
    console.error("Error fetching review target:", error);
    return { success: false, error: "Failed to load chat details." };
  }
}


export async function submitReviewAction(data: ReviewPayload) {
  try {
    await connectToDatabase();
    const reviewerId = await getSessionUserId();
    
    if (!reviewerId) return { success: false, error: "Unauthorized" };
    if (reviewerId === data.targetUserId) return { success: false, error: "Cannot review yourself." };

    const targetUser = await User.findById(data.targetUserId);
    if (!targetUser) return { success: false, error: "User not found." };

    // ==========================================
    // THE TRUST ALGORITHM
    // ==========================================

    if (!data.didShowUp) {
      // THE FLAKE PENALTY: Nuke their score and stop immediately.
      targetUser.credibilityScore -= 50;
      
    } else {
      // 1. THEY SHOWED UP: Base points awarded
      const BASE_POINTS = 10;

      // 2. CALCULATE THE MULTIPLIER (Average of the 3 ratings)
      // Fallback to 3 (neutral) if a rating is somehow missing
      const safeScore = data.safety || 3;
      const punctualScore = data.punctuality || 3;
      const authenticScore = data.authenticity || 3;
      
      const averageRating = (safeScore + punctualScore + authenticScore) / 3;
      const multiplier = averageRating / 5; // e.g., 4.5 avg / 5 = 0.9x multiplier

      // 3. APPLY POINTS
      const earnedPoints = BASE_POINTS * multiplier;
      
      // Add points and round to 1 decimal place (e.g., +8.4)
      targetUser.credibilityScore += parseFloat(earnedPoints.toFixed(1));

      // 4. INCREMENT SUCCESSFUL EVENTS LEDGER
      if (data.role === "host") {
        targetUser.hostedCount += 1;
      } else {
        targetUser.attendedCount += 1;
      }

      // 5. INJECT BADGE (If awarded)
      if (data.badge && data.badge !== "none") {
        // We use || 0 just in case the database object wasn't fully initialized
        targetUser.badges[data.badge] = (targetUser.badges[data.badge] || 0) + 1;
      }
    }

    // Save all changes to the database atomically
    await targetUser.save();

    // Optional: Check if they should be shadowbanned
    if (targetUser.credibilityScore <= -100) {
      console.log(`[ALERT] User ${targetUser._id} hit -100 credibility. Consider shadowban.`);
      // targetUser.isBanned = true; // For future implementation
    }

    return { success: true };
    
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return { success: false, error: "Failed to process review." };
  }
}