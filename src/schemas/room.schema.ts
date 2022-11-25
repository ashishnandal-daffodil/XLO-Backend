import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import { User } from "./user.schema";
import { Message } from "./message.schema";

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  buyer_id: string;

  @Prop()
  seller_id: string;

  @Prop()
  product_id: string;

  @Prop()
  messages: Message[];

  @Prop()
  latest_message: Message;

  @Prop()
  unread_messages: [
    {
      userId: string;
      count: number;
    }
  ];

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
