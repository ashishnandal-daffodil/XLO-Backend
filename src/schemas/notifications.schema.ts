import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop()
  userId: string;

  @Prop()
  notifications: [
    {
      type: string;
      messageCount: number;
      roomId: string;
      senderName: string;
      created_on: string;
    }
  ];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
