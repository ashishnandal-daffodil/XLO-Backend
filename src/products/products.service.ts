import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product as Product_Entity } from './entities/product.entity';
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

  private products: Product_Entity[] = [
    {
      id: 1,
      title: 'i10 Magna',
      price: 10000,
      description: 'Car for Sale',
      category: 'Car',
      purchased_on: new Date('23 Aug 2019'),
      owner: 1,
      photos: [],
      thumbnail_url: '',
      thumbnail_uploaded: false,
      active: true,
      created_on: new Date('2 Sep 2021'),
      updated_on: null,
      expire_on: new Date('2 Oct 2022'),
      closed_on: null,
    },
    {
      id: 2,
      title: 'i20 Magna',
      price: 20000,
      description: 'Car for Sale',
      category: 'Car',
      purchased_on: new Date('25 Aug 2020'),
      owner: 1,
      photos: [],
      thumbnail_url: '',
      thumbnail_uploaded: false,
      active: true,
      created_on: new Date('20 Oct 2021'),
      updated_on: null,
      expire_on: new Date('21 Nov 2022'),
      closed_on: null,
    },
    {
      id: 3,
      title: 'i30 Magna',
      price: 30000,
      description: 'Car for Sale',
      category: 'Car',
      purchased_on: new Date('25 Aug 2020'),
      owner: 1,
      photos: [],
      thumbnail_url: '',
      thumbnail_uploaded: false,
      active: true,
      created_on: new Date('20 Oct 2021'),
      updated_on: null,
      expire_on: new Date('21 Nov 2022'),
      closed_on: null,
    },
    {
      id: 4,
      title: 'i40 Magna',
      price: 400000,
      description: 'Car for Sale',
      category: 'Car',
      purchased_on: new Date('25 Aug 2020'),
      owner: 1,
      photos: [],
      thumbnail_url: '',
      thumbnail_uploaded: false,
      active: true,
      created_on: new Date('20 Oct 2021'),
      updated_on: null,
      expire_on: new Date('21 Nov 2022'),
      closed_on: null,
    },
    {
      id: 5,
      title: 'i50 Magna',
      price: 500000,
      description: 'Car for Sale',
      category: 'Car',
      purchased_on: new Date('25 Aug 2020'),
      owner: 1,
      photos: [],
      thumbnail_url: '',
      thumbnail_uploaded: false,
      active: true,
      created_on: new Date('20 Oct 2021'),
      updated_on: null,
      expire_on: new Date('21 Nov 2022'),
      closed_on: null,
    },
  ];

  async create(ProductData) {
    return this.productModel.insertMany(ProductData);
  }

  async findAll(skip = 0, limit: number) {
    const query = this.productModel
      .find()
      // .select({ id: 1, title: 1 })
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
