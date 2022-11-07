import { Injectable } from "@nestjs/common";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { Product as Product_Def, ProductDocument } from "../schemas/product.schema";
import { CategoryService } from "src/categories/categories.service";
import { ObjectID } from "typeorm";
import { unlink } from "fs";

@Injectable()
export class ProductsService {
  collation = { locale: "en", strength: 2 };
  constructor(
    @InjectModel(Product_Def.name) private productModel: Model<ProductDocument>,
    private categoryService: CategoryService
  ) {}

  async create(ProductData): Promise<any> {
    return this.productModel.insertMany(ProductData);
  }

  async findAll(userId, filterKey, category, skip = 0, limit: number): Promise<any> {
    let query;
    let filter = this.createFilter(filterKey, userId, category);
    if (Number(filterKey)) {
      filter["$or"].push({ price: filterKey });
    }
    query = this.productModel.find(filter).collation(this.collation).sort({ created_on: -1 }).skip(skip);
    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findMyAds(userId, skip = 0, limit: number): Promise<any> {
    let query;
    query = this.productModel.find({ "seller._id": userId, active: true }).sort({ created_on: -1 }).skip(skip);
    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findOne(id: string): Promise<any> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async findSuggestions(filterKey): Promise<any> {
    let filter = this.createFilter(filterKey);
    return this.productModel
      .find(filter, { title: 1, category: 1, location: 1, subcategory: 1 })
      .collation(this.collation)
      .sort({ _id: 1 });
  }

  async delete(productId, productImages): Promise<any> {
    for (let productImageName of productImages) {
      unlink(`uploads/productimages/${productImageName}`, err => {
        if (err) throw err;
      });
    }
    return this.productModel.updateMany({ "_id": productId }, { $set: { active: false } });
  }

  async update(ProductData): Promise<any> {
    //remove images from server folder and also update the photos field of product
    for (let productImageName of ProductData.deletedImages.deletedImages) {
      let productImageFileName = productImageName.split("productimage/")[1];
      unlink(`uploads/productimages/${productImageFileName}`, err => {
        if (err) throw err;
      });
      this.updatePhotos(ProductData.productId, productImageFileName);
    }
    //update product data
    return this.productModel.updateOne(
      { _id: ProductData.productId },
      {
        $set: {
          category: ProductData.category,
          subcategory: ProductData.subcategory,
          title: ProductData.title,
          description: ProductData.description,
          owner: ProductData.owner,
          price: ProductData.price,
          location: ProductData.location,
          updated_on: ProductData.updated_on
        },
        $push: {
          photos: {
            $each: ProductData.photos
          }
        }
      }
    );
  }

  async updatePhotos(productId, productImageFileName) {
    return this.productModel.findByIdAndUpdate({ _id: productId }, { $pull: { photos: productImageFileName } });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  createFilter(filterKey, userId?, category?) {
    let filter = { "active": true };
    if (filterKey) {
      filter["$or"] = [
        { title: { $regex: `(?i)${filterKey}(?-i)` } },
        { category: { $regex: `(?i)${filterKey}(?-i)` } },
        { subcategory: { $regex: `(?i)${filterKey}(?-i)` } },
        { location: { $regex: `(?i)${filterKey}(?-i)` } }
      ];
    }
    if (userId) {
      filter["seller._id"] = { "$ne": userId };
    }
    if (category) {
      filter["category"] = category;
    }
    return filter;
  }
}
