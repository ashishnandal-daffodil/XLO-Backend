import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "../schemas/product.schema";
import { CategoryModule } from "src/categories/categories.module";
import { SearchModule } from "src/search/search.module";
import { SearchService } from "src/search/search.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), CategoryModule, SearchModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
