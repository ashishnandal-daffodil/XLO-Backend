import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "../schemas/product.schema";
import { SharpModule } from "nestjs-sharp";

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),SharpModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
