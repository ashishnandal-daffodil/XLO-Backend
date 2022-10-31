import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get("allProduct")
  async findAll(@Query() { filterKey, skip, limit }) {
    return this.productsService.findAll(filterKey, skip, limit);
  }

  @Get("myAds")
  async findMyAds(@Query() { userId, skip, limit }) {
    return this.productsService.findMyAds(userId, skip, limit);
  }

  @Get("suggestions")
  async getSuggestions(@Query() { filterKey }) {
    return this.productsService.findSuggestions(filterKey);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(+id);
  }
}
