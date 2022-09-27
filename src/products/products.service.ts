import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import {
  Product as Product_Def,
  ProductDocument,
} from '../schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product_Def.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(ProductData) {
    return this.productModel.insertMany(ProductData);
  }

  async findAll(skip = 0, limit: number) {
    const query = this.productModel
      .find()
      .sort({ _id: 1 })
      .skip(skip);

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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
