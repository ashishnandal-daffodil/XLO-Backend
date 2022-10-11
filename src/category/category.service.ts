import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Category as Category_Def,CategoryDocument } from 'src/schemas/category.schema';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category_Def.name) private categoryModel: Model<CategoryDocument>,){}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.insertMany(createCategoryDto)
  }

  async findAll(skip=0,limit:number) {
    const result = this.categoryModel.find().sort({'name':1}).skip(skip).limit(limit);
    return result;
  }

  // async remove(name:string){
  //   const result = await this.categoryModel.deleteMany({'name':name});
  //   return result;
  // }
}
