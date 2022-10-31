import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { CategoryService } from "./categories.service";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("allCategories")
  async findAll() {
    return this.categoryService.findAll();
  }
}
