import mongoose, { Schema, Document, models } from "mongoose";

export interface IWaitlist extends Document {
  email: string;
  createdAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Prevent mongoose from compiling the model multiple times in Next.js
export const Waitlist = models.Waitlist || mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);