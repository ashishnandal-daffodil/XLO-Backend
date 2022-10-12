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

  async create({id,thumbnail_url,...rest}:CreateProductDto) {
    const count = await this.productModel.find().count();
    id=count+1;
    // const thumb_url=rest.photos[0];
    // const thumb_img= await axios({url:thumb_url,responseType:'arraybuffer'});
    // const buffer= Buffer.from(thumb_img.data,'binary');
    // // console.log("thumb_url ",thumb_url.toString())
    
    // const res=await this.sharpService.edit(buffer).resize(200, 200).png().toBuffer();

    // // console.log("thum_img ",thum_img);
    // return res;
    // return "done;
//     sharp(req.file.path).resize(200, 200).toFile('uploads/' + 'thumbnails-' + req.file.originalname, (err, resizeImage) => {
//       if (err) {
//            console.log(err);
//       } else {
//            console.log(resizeImage);
//       }
// });

    const data:CreateProductDto={id,thumbnail_url,...rest};
    return this.productModel.insertMany(data);
  }

  async findAllCategory() {
       return this.productModel.distinct('category');
  }

  async findAll(skip = 0, limit: number,category:string) {
    if(category?.length>0){
      const query = this.productModel.find({'category':category}).sort({ _id: 1 }).skip(skip).limit(limit);
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
