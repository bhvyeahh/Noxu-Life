import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  beaconId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  message: string;
  status: "pending" | "hold" | "accepted" | "declined";
}

const RequestSchema = new Schema<IRequest>(
  {
    beaconId: { type: Schema.Types.ObjectId, ref: "Beacon", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, maxlength: 300 },
    status: { type: String, enum: ["pending", "hold", "accepted", "declined"], default: "pending" },
  },
  { timestamps: true }
);

// COMPOUND INDEX: A user can only have ONE active request per beacon
RequestSchema.index({ beaconId: 1, senderId: 1 }, { unique: true });

export const Request = mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);