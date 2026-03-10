import mongoose, { Schema, Document } from "mongoose";

export interface IBeacon extends Document {
  hostId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  vibe: "coffee" | "dining" | "culture" | "nightlife";
  venueName: string; // Hidden from public feed
  location: {
    type: "Point";
    coordinates: number[]; // [longitude, latitude]
  };
  status: "active" | "filled" | "expired";
  expiresAt: Date;
}

const BeaconSchema = new Schema<IBeacon>(
  {
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 60 },
    description: { type: String, required: true, maxlength: 200 },
    vibe: { type: String, enum: ["coffee", "dining", "culture", "nightlife"], required: true },
    venueName: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // Must be [lng, lat]
    },
    status: { type: String, enum: ["active", "filled", "expired"], default: "active" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// GEOSPATIAL INDEX: Crucial for calculating "X km away" efficiently
BeaconSchema.index({ location: "2dsphere" });
// TTL INDEX: Auto-deletes the beacon from the DB exactly when expiresAt is reached
BeaconSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Beacon = mongoose.models.Beacon || mongoose.model<IBeacon>("Beacon", BeaconSchema);