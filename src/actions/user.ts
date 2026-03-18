"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

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

export async function getCurrentUserAction() {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false };

    // FIX: Cast the lean() result to 'any' (or your exact interface) so TypeScript stops screaming
    const user = await User.findById(userId).lean() as any;
    
    if (!user) return { success: false };

    return { 
      success: true, 
      user: {
        id: user._id.toString(),
        name: user.name,
        age: user.age,
        avatar: user.avatar,
        bio: user.bio || "",
        vibeTags: user.vibeTags || [],
        isStatsVisible: user.isStatsVisible !== false, // Defaults to true
        hostedCount: user.hostedCount || 0,
        attendedCount: user.attendedCount || 0,
        credibilityScore: user.credibilityScore || 0,
      } 
    };
  } catch (error) {
    return { success: false };
  }
}

export async function updateUserProfileAction(data: {
  bio: string;
  vibeTags: string[];
  isStatsVisible: boolean;
}) {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    if (data.vibeTags.length > 3) {
      return { success: false, error: "You can only select up to 3 vibe tags." };
    }

    await User.findByIdAndUpdate(userId, {
      bio: data.bio.trim().substring(0, 160),
      vibeTags: data.vibeTags,
      isStatsVisible: data.isStatsVisible,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile." };
  }
}