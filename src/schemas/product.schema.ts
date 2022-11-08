import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  id: number;

  @Prop()
  seller_id: ObjectId;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  subcategory: string;

  @Prop()
  location: string;

  @Prop()
  search: string;

  @Prop()
  purchased_on: Date;

  @Prop()
  owner: string;

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

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index(
  { title: "text", category: "text", location: "text" },
  { collation: { locale: "en", strength: 2 } }
);

export { ProductSchema };
