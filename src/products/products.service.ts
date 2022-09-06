import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      title: 'i20 Magna',
      price: 570000,
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
  ];
  private idSeq = 0;

  create(createProductDto: CreateProductDto) {
    this.products.push({
      ...createProductDto,
      id: this.idSeq++,
    });
    return this.products.at(-1);
  }

  findAll(): Product[] {
    console.log('findAlll');
    return this.products;
  }

  findOne(id: number): Product {
    return this.products.find((product) => product.id === id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
