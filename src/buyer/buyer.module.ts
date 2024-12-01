import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerService } from './buyer.service'; // Import Buyer service
import { BuyerController } from './buyer.controller'; // Import Buyer controller
import { Buyer } from './buyer.entity'; // Import Buyer entity
//import { ProductService } from '../product/product.service'; // Import Product service
import { ProductModule } from '../product/product.module'; // Import Product module to use ProductService

@Module({
  imports: [
    TypeOrmModule.forFeature([Buyer]), // Register Buyer entity to use BuyerRepository
    ProductModule, // Import ProductModule to access ProductService
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
})
export class BuyerModule {}
