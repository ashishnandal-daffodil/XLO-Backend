import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  mobile: string;

  @Prop()
  password: string;

  @Prop()
  created_on: Date;

  @Prop()
  updated_on: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
