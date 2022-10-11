import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('allCategory')
  async findAll(@Query() { skip,limit }) {
    return this.categoryService.findAll(skip,limit);
  }

  // @Delete('deleteCategory')
  // async remove(@Body() name:string):Promise<Cat> {
  //   return this.categoryService.remove(name);
  // }
}
