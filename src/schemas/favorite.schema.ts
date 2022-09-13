import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Product } from "./product.schema";
import { User } from "./user.schema";

export type FavoriteDocument = Favorite & Document;

@Schema()
export class Favorite {
  @Prop()
  favorite: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Owner" })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Owner" })
  product: Product;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
