import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Seller } from './seller.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  id: number;

  @Prop()
  seller: Seller;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  purchased_on: Date;

  @Prop()
  owner: number;

  @Prop([String])
  photos: string[];

  @Prop()
  thumbnail_url: string;

  @Prop()
  thumbnail_uploaded: boolean;

  @Prop()
  active: boolean;

  @Prop()
  created_on: Date;

  @Prop()
  updated_on: Date;

  @Prop()
  expire_on: Date; //(30 days max after created)

  @Prop()
  closed_on: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
