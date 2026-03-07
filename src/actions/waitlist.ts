"use server";

import { connectToDatabase } from "@/lib/db/connect";
import { Waitlist } from "@/lib/models/Waitlist";
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
    
    // TEMPORARY FIX: For testing, we'll let it try to send the email EVEN IF they are in the DB.
    // (We will change this back later, but we need to test the email delivery!)
    if (!existingEntry) {
       await Waitlist.create({ email: email.toLowerCase() });
       console.log("✅ Saved to MongoDB");
    } else {
       console.log("⚠️ Email already in DB, but attempting to send Resend email anyway for testing.");
    }

    // Capture the Resend response properly
    const { data, error } = await resend.emails.send({
      from: "Noxu <onboarding@layoutory.in>", 
      to: email, // MUST be the email you signed up to Resend with!
      subject: "Welcome to the Inner Circle - Noxu",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #EEE5E9; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #2a2a2a;">
          <h2 style="color: #ffffff; font-weight: 600; letter-spacing: -0.5px;">You're on the list.</h2>
          <p style="color: #a1a1a1; font-size: 16px; line-height: 1.6;">Hey there,</p>
          <p style="color: #a1a1a1; font-size: 16px; line-height: 1.6;">Thanks for requesting access to Noxu Life.</p>
        </div>
      `,
    });

    // Explicitly check for Resend API errors
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