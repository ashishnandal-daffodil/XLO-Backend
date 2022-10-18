import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import {
  Product as Product_Def,
  ProductDocument,
} from '../schemas/product.schema';
import { CreateProductDto } from "./dto/create-product.dto";
import { SharpService } from "nestjs-sharp";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product_Def.name) private productModel: Model<ProductDocument>,
    private sharpService: SharpService,
  ) {}

  async create(rest:CreateProductDto) {
    const count = await this.productModel.find().count();
    const idx=count+1;
    // const thumb_url=rest.photos[0];
    
    const data:CreateProductDto={id:idx,...rest};
    return this.productModel.insertMany(data);
  }


  async findAllTitle() {
    return this.productModel.distinct('title');
}

  async findAllCategory() {
       return this.productModel.distinct('category');
  }

  async findSuggestions(filterKey) {
    let filter = this.createFilter(filterKey);
    return this.productModel.find(filter, { title: 1, category: 1, location: 1, price: 1 }).sort({ _id: 1 });
  }

  async findAll(filterKey,skip = 0, limit: number) {
    let query;
    if (filterKey) {
      let filter = this.createFilter(filterKey);
      query = this.productModel.find(filter).sort({ _id: 1 }).skip(skip);
    } else {
      query = this.productModel.find().sort({ _id: 1 }).skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }
    console.log(query);
    return query;
    
  }
  

  createFilter(filterKey) {
    let filter;
    if (Number(filterKey)) {
      filter = {
        $or: [
          { title: { $regex: filterKey } },
          { category: { $regex: filterKey } },
          { location: { $regex: filterKey } },
          { price: Number(filterKey) }
        ]
      };
    } else {
      filter = {
        $or: [
          { title: { $regex: filterKey } },
          { category: { $regex: filterKey } },
          { location: { $regex: filterKey } }
        ]
      };
    }
    return filter;
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
