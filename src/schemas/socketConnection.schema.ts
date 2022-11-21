import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type SocketConnectionDocument = SocketConnection & Document;

@Schema()
export class SocketConnection {
  @Prop()
  user_id: string;

  @Prop()
  socket_id: string;
}

export const SocketConnectionSchema = SchemaFactory.createForClass(SocketConnection);
