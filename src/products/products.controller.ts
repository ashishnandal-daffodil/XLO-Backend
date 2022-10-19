import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors,UploadedFile } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SharpService } from "nestjs-sharp";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService,private sharpService: SharpService) {}

  @Post('addProduct')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file',{
      storage:diskStorage({
        destination: 'mongodb://localhost/nest/uploads',
        filename:(req,file,callback)=>{
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename =`${uniqueSuffix}${ext}`;
        callback(null,filename);

        },
      }),
    }),
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'File upload API';
  }



  @Get('allTitle')
  async findAllTitle(@Query() { skip=0,limit }) {
    const data = await this.productsService.findAllTitle();
    if(limit){
      return data.slice(skip,limit);
    }
    else{
      return data;
    }
  
  }

  @Get("suggestions")
  async getSuggestions(@Query() {filterKey}) {
    return this.productsService.findSuggestions(filterKey);
  }

  @Get('allProduct')
  async findAll(@Query() { filterKey, skip, limit }) {  
    return this.productsService.findAll(filterKey, skip, limit);
  }


  @Get('allCategory')
  async findAllCategories(@Query() { skip=0,limit }) {
    const data = await this.productsService.findAllCategory();
    if(limit){
      return data.slice(skip,limit);
    }
    else{
      return data;
    }
  
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(+id);
  }
}
