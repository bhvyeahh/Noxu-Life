import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IMessage extends Document {
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  chatId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now,
    // THE BURNER ENGINE: MongoDB will physically delete this document after 86400 seconds (24 hours)
    expires: 86400 
  }
});

// Prevent Mongoose from compiling the model multiple times in Next.js development
export const Message = models.Message || model<IMessage>("Message", MessageSchema);