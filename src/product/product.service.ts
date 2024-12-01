import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Farmer } from '../farmer/farmer.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) {}

  async createProduct(
    farmerId: number,
    productData: CreateProductDto,
  ): Promise<Product> {
    const farmer = await this.farmerRepository.findOne({
      where: { farmer_id: farmerId },
    });

    if (!farmer) {
      throw new NotFoundException(`Farmer with ID ${farmerId} not found`);
    }

    const product = this.productRepository.create({
      ...productData,
      farmer,
    });

    return this.productRepository.save(product);
  }

  async updateProduct(
    productId: number,
    farmerId: number,
    updateData: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_id: productId, farmer: { farmer_id: farmerId } },
      relations: ['farmer'],
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${productId} not found for Farmer with ID ${farmerId}`,
      );
    }

    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  async findUniqueCategories(): Promise<string[]> {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.product_category', 'category')
      .getRawMany();

    return categories.map((row) => row.category);
  }

  async deleteProduct(productId: number, farmerId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { product_id: productId, farmer: { farmer_id: farmerId } },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${productId} not found for Farmer with ID ${farmerId}`,
      );
    }

    await this.productRepository.remove(product);
  }

  async findProductsByFarmer(farmerId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { farmer: { farmer_id: farmerId } },
    });
  }

  async findProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { product_category: category },
    });
  }
}
