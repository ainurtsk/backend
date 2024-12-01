import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../product/product.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getUniqueCategories(): Promise<string[]> {
    return this.productService.findUniqueCategories();
  }
}
