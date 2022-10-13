import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type sellerDocument = Seller & Document;

@Schema()
export class Seller {

  @Prop()
  id:string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  mobile: string;

  @Prop()
  created_on: Date;

 
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
