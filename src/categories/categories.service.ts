import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Category as Category_Def, CategoryDocument } from "src/schemas/categories.schema";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category_Def.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async create(ProductData) {
    return this.categoryModel.insertMany({ category_name: ProductData.category });
  }

  async findAll() {
    return this.categoryModel.find().sort({ _id: 1 });
  }
}
