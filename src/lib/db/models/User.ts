import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  avatar: string;
  bio: string;
  vibeTags: string[];
  hostedCount: number;
  attendedCount: number;
  isStatsVisible: boolean;
  credibilityScore: number;
  badges: {
    trustworthy: number;
    entertainer: number;
    punctual: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // --- AUTH ---
    phone: { type: String, required: true, unique: true, index: true },
    
    // --- THE LOCKED VAULT (Immutable after creation) ---
    name: { type: String, required: true, trim: true, immutable: true },
    age: { type: Number, required: true, min: 18, immutable: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true, immutable: true },
    
    // --- PERSONALITY & APPEARANCE ---
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 160 }, // Kept short like a tweet
    vibeTags: { 
      type: [String], 
      validate: [arrayLimit, "You can only select up to 3 vibe tags."]
    },

    // --- THE TRUST LEDGER ---
    hostedCount: { type: Number, default: 0 },
    attendedCount: { type: Number, default: 0 },
    isStatsVisible: { type: Boolean, default: true }, // Privacy toggle
    credibilityScore: { type: Number, default: 0 },   // Master trust score

    // --- POSITIVE VOUCHES (Post-Event Ratings) ---
    badges: {
      trustworthy: { type: Number, default: 0 }, // Reliable, safe, accurate profile
      entertainer: { type: Number, default: 0 }, // Great energy, fun, kept conversation going
      punctual: { type: Number, default: 0 }     // Showed up on time, good communication
    }
  },
  { timestamps: true }
);

// Custom Validator function to strictly enforce the "Rule of 3"
function arrayLimit(val: string[]) {
  return val.length <= 3;
}

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);