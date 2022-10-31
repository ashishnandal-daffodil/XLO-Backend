import { Injectable } from "@nestjs/common";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { Product as Product_Def, ProductDocument } from "../schemas/product.schema";
import { CategoryService } from "src/categories/categories.service";
import { ObjectID } from "typeorm";

@Injectable()
export class ProductsService {
  collation = { locale: "en", strength: 2 };
  constructor(
    @InjectModel(Product_Def.name) private productModel: Model<ProductDocument>,
    private categoryService: CategoryService
  ) {}

  async create(ProductData) {
    await this.categoryService.create(ProductData);
    return this.productModel.insertMany(ProductData);
  }

  async findAll(filterKey, skip = 0, limit: number) {
    let query;
    if (filterKey) {
      let filter = this.createFilter(filterKey);
      if (Number(filterKey)) {
        filter.$or.push({ price: filterKey });
      }
      query = this.productModel.find(filter).collation(this.collation).sort({ _id: 1 }).skip(skip);
    } else {
      query = this.productModel.find().sort({ _id: 1 }).skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findMyAds(userId, skip = 0, limit: number) {
    let query;
    query = this.productModel.find({ "seller._id": userId }).sort({ _id: 1 }).skip(skip);

    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async findSuggestions(filterKey) {
    let filter = this.createFilter(filterKey);
    return this.productModel.find(filter, { title: 1, category: 1, location: 1, subcategory: 1 }).sort({ _id: 1 });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  createFilter(filterKey) {
    let filter;
    filter = {
      $or: [
        { title: { $regex: `(?i)${filterKey}(?-i)` } },
        { category: { $regex: `(?i)${filterKey}(?-i)` } },
        { subcategory: { $regex: `(?i)${filterKey}(?-i)` } },
        { location: { $regex: `(?i)${filterKey}(?-i)` } }
      ]
    };
    return filter;
  }
}
