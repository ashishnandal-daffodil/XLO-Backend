import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  message: string;

  @Prop()
  sender: string;

  @Prop()
  receiver: string;

  @Prop()
  created_on: Date;

  @Prop()
  updated_on: Date;
}

export const UserSchema = SchemaFactory.createForClass(Message);
