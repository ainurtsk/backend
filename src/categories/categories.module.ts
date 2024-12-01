import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity'; // Import the Product entity
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ProductModule } from '../product/product.module'; // Import the ProductModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // Ensure the Product entity is available
    ProductModule, // Import ProductModule to make ProductRepository available
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
