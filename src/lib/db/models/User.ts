import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  avatar: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18 },
    // immutable: true prevents the field from being changed after saving
    gender: { type: String, enum: ["male", "female", "other"], required: true, immutable: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);