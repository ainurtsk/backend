import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/farmer/:farmerId')
  async createProduct(
    @Param('farmerId') farmerId: number,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(farmerId, createProductDto);
  }

  @Patch('/:productId/farmer/:farmerId')
  async updateProduct(
    @Param('productId') productId: number,
    @Param('farmerId') farmerId: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(
      productId,
      farmerId,
      updateProductDto,
    );
  }

  @Delete('/:productId/farmer/:farmerId')
  async deleteProduct(
    @Param('productId') productId: number,
    @Param('farmerId') farmerId: number,
  ): Promise<void> {
    return this.productService.deleteProduct(productId, farmerId);
  }

  @Get('/farmer/:farmerId')
  async findProductsByFarmer(
    @Param('farmerId') farmerId: number,
  ): Promise<Product[]> {
    return this.productService.findProductsByFarmer(farmerId);
  }

  @Get('/categories/:category')
  async findProductsByCategory(
    @Param('category') category: string,
  ): Promise<Product[]> {
    return this.productService.findProductsByCategory(category);
  }

  @Get('/categories')
  async getUniqueCategories(): Promise<string[]> {
    return this.productService.findUniqueCategories();
  }
}
