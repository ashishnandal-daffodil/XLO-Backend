import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  message: string;

  @Prop()
  sender: string;

  @Prop()
  created_on: String;

  @Prop()
  updated_on: String;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
