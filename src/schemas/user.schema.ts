import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { type } from "os";

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
  about_me: string;

  @Prop()
  profile_image_filename: string;

  @Prop()
  password: string;

  @Prop({ type: Object })
  reset_password_token: {
    token: string;
    created_on: Date;
  };

  @Prop()
  created_on: Date;

  @Prop()
  updated_on: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
