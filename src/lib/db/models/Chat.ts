import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  beaconId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: Array<{
    senderId: mongoose.Types.ObjectId;
    text: string;
    timestamp: Date;
  }>;
  expiresAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    beaconId: { type: Schema.Types.ObjectId, ref: "Beacon", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL INDEX: Automatically deletes the entire chat history when the time is up
ChatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);