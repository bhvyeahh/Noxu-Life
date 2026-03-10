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

/**
 * Fetches the currently logged-in user's profile data
 */
export async function getCurrentUserAction() {
  try {
    await connectToDatabase();
    const userId = await getSessionUserId();
    
    if (!userId) return { success: false, error: "Not authenticated" };

    // THE FIX: Added 'as any' to bypass the strict Mongoose type error
    const user = (await User.findById(userId).select("name avatar phone age").lean()) as any;
    
    if (!user) return { success: false, error: "User not found" };

    return { 
      success: true, 
      user: {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        age: user.age
      } 
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return { success: false, error: "Server error" };
  }
}