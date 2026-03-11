"use server";

import { connectToDatabase } from "@/lib/db/connect";
import { Waitlist } from "@/lib/db/models/Waitlist";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(email: string) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, message: "Invalid email address." };
  }

  try {
    await connectToDatabase();

    const existingEntry = await Waitlist.findOne({ email: email.toLowerCase() });
    
    if (!existingEntry) {
       await Waitlist.create({ email: email.toLowerCase() });
       console.log("✅ Saved to MongoDB");
    } else {
       console.log("⚠️ Email already in DB, but attempting to send Resend email anyway for testing.");
    }

    // Back to the absolute simplest version to bypass content filters
    const { data, error } = await resend.emails.send({
      from: "Noxu <onboarding@layoutory.in>", 
      to: email, 
      subject: "Welcome to Noxu",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #EEE5E9; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #2a2a2a;">
          <h2 style="color: #ffffff; font-weight: 600; letter-spacing: -0.5px;">You're on the list.</h2>
          
          <p style="color: #a1a1a1; font-size: 16px; line-height: 1.6;">Hey there,</p>
          
          <p style="color: #a1a1a1; font-size: 16px; line-height: 1.6;">Thanks for requesting access to Noxu. We've saved your spot.</p>
          
          <p style="color: #a1a1a1; font-size: 16px; line-height: 1.6;">We'll reach out as soon as your city unlocks.</p>
          
          <br>
          <p style="color: #ffffff; font-size: 16px; font-weight: 600;">The Noxu Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return { success: false, message: `Email failed to send: ${error.message}` };
    }

    console.log("✅ Resend Email Sent successfully:", data);
    return { success: true, message: "Successfully joined the waitlist." };

  } catch (err: any) {
    console.error("❌ Catch Block Error:", err);
    return { success: false, message: "Server error occurred." };
  }
}

export async function getWaitlistCount() {
  try {
    // THIS WAS MISSING: You must connect to the DB before counting
    await connectToDatabase();
    
    const count = await Waitlist.countDocuments(); 
    
    console.log(`📊 DB Count Fetched: ${count} real users`);
    
    // Returning the real count + 42 (seed number so it doesn't look empty on day 1)
    return count + 22; 
  } catch (error) {
    console.error("❌ Failed to fetch waitlist count:", error);
    // If DB fails, return 42 so the UI doesn't break or show 0
    return 42;
  }
}