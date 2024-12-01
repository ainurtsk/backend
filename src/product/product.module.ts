import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { Farmer } from '../farmer/farmer.entity';
import { FarmerModule } from '../farmer/farmer.module';
import { ProductController } from './product.controller';
//import { FarmerModule } from '../farmer/farmer.module'; // Import Farmer module if needed

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Farmer]), // Register Product and Farmer repositories
    FarmerModule, // If FarmerRepository is used in ProductService
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], // If you need to use ProductService in other modules
})
export class ProductModule {}
