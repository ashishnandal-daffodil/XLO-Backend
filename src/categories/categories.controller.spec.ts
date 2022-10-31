import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './categories.contoller';
import {CategoryService} from './categories.service';

describe('ProductsController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
