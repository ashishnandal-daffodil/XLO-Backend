import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
  Put,
  UseInterceptors,
  UploadedFiles,
  Param,
  Res,
  Patch,
  Delete
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { diskStorage } from "multer";
import path = require("path");
import { v4 as uuidv4 } from "uuid";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Observable, of, tap } from "rxjs";
import { join } from "path";

export const storage = {
  storage: diskStorage({
    destination: "./uploads/productimages",
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    }
  })
};

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("upload")
  @UseInterceptors(FilesInterceptor("photos", 5, storage))
  uploadFile(@UploadedFiles() files, @Body() body: any) {
    const filenames = files.map(file => {
      return file.filename;
    });
    body.photos = filenames;
    body.seller_id = body.seller_id;
    body.created_on = new Date();
    body.updated_on = new Date();
    return this.productsService.create(body);
  }

  @Put("delete")
  async delete(@Body() body: any) {
    return this.productsService.delete(body.productId, body.productImages);
  }

  @Put("update")
  @UseInterceptors(FilesInterceptor("photos", 5, storage))
  async updateProduct(@UploadedFiles() files, @Body() body: any) {
    if (files) {
      const filenames = files.map(file => {
        return file.filename;
      });
      body.photos = filenames;
    }
    if (body.deletedImages) {
      body.deletedImages = JSON.parse(body.deletedImages);
    }
    body.changes = JSON.parse(body.changes);
    body.changes.updated_on = new Date();
    return this.productsService.update(body);
  }

  @Get("productimage/:imagename")
  findProfileImage(@Param("imagename") imagename, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), "uploads/productimages/" + imagename)));
  }

  @Get("allProduct")
  async findAll(@Query() { userId, filterKey, category, skip, limit }) {
    return this.productsService.findAll(userId, filterKey, category, skip, limit);
  }

  @Get("myAds")
  async findMyAds(@Query() { userId, skip, limit }) {
    return this.productsService.findMyAds(userId, skip, limit);
  }

  @Get("myDeletedAds")
  async findMyDeletedAds(@Query() { userId, skip, limit }) {
    return this.productsService.findMyDeletedAds(userId, skip, limit);
  }

  @Get("myExpiredAds")
  async findMyExppiredAds(@Query() { userId, skip, limit }) {
    return this.productsService.findMyExpiredAds(userId, skip, limit);
  }

  @Get("suggestions")
  async getSuggestions(@Query() { filterKey }) {
    return this.productsService.findSuggestions(filterKey);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }
}
