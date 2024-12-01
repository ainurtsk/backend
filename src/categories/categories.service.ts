import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity'; // Import Product entity

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, // Inject ProductRepository
  ) {}

  // Method to get unique categories
  async getUniqueCategories(): Promise<string[]> {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.product_category', 'category')
      .getRawMany();

    return categories.map((row) => row.category);
  }

  // Method to get products by category
  async getProductsByCategory(category: string) {
    return this.productRepository.find({
      where: { product_category: category },
    });
  }
}
