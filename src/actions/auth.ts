"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

// Initialize the secret key
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment variables.");
  return new TextEncoder().encode(secret);
};

// Internal function to create a secure session cookie
async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Sign the JWT
  const sessionToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecretKey());

  // FIX: Next.js 15+ requires cookies() to be awaited
  const cookieStore = await cookies();
  
  cookieStore.set("noxu_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// ------------------------------------------------------------------
// SERVER ACTIONS CALLED FROM THE FRONTEND
// ------------------------------------------------------------------

/**
 * 1. Sends the OTP to the user's phone.
 */
export async function sendOtpAction(phone: string) {
  try {
    console.log(`[DEV MODE] 🔐 OTP for +91 ${phone} is: 123456`);
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: "Failed to send OTP" };
  }
}

/**
 * 2. Verifies the OTP and checks if the user exists in MongoDB.
 */
export async function verifyOtpAction(phone: string, otp: string) {
  try {
    if (otp !== "123456") {
      return { success: false, error: "Invalid OTP code." };
    }

    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      // User exists! Log them in immediately.
      await createSession(existingUser._id.toString());
      return { success: true, isNewUser: false };
    }

    // User does not exist, tell frontend to show Profile Setup
    return { success: true, isNewUser: true };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Verification failed" };
  }
}

/**
 * 3. Completes profile setup for brand new users and logs them in.
 */
export async function completeProfileAction(phone: string, name: string, age: number, gender: string) {
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return { success: false, error: "Account already exists for this number." };
    }

    // Create the new user in MongoDB
    const newUser = await User.create({
      phone,
      name,
      age,
      gender,
      avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=" + name,
    });

    // Log them in
    await createSession(newUser._id.toString());
    
    return { success: true };
  } catch (error: any) {
    // FIX: Catch Mongoose Validation errors (like age < 18) and send them to the UI
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return { success: false, error: messages.join(" ") };
    }
    
    console.error("Error creating profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}

/**
 * 4. Securely logs the user out by destroying the session cookie
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("noxu_session");
  return { success: true };
}