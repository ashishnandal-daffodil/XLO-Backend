import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type UserConnectionDocument = UserConnection & Document;

@Schema()
export class UserConnection {
  @Prop()
  lastUpdatedOn: Date;

  @Prop()
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  user: User;
}

export const UserConnectionSchema =
  SchemaFactory.createForClass(UserConnection);
