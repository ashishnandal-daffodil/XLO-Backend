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

  async findAll(skip = 0, limit: number,category:string,title:string) {
    if(category?.length>0){
      const query = this.productModel.find({'category':category}).sort({ _id: 1 }).skip(skip).limit(limit);
      return query;

    }
    else if(title?.length>0){
      const query = this.productModel.find({'title':title}).sort({ _id: 1 }).skip(skip).limit(limit);
      return query;
    }
    else{
    const query = this.productModel.find().sort({ _id: 1 }).skip(skip).limit(limit);
    return query;

    }
    
  }
  // async findAll(skip = 0, limit: number) {
    
  //   const query = this.productModel.find().sort({ _id: 1 }).skip(skip).limit(limit);
  //   return query;

    
  
  // }

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
