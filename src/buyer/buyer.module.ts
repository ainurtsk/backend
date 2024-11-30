import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './buyer.entity'; // Import the Buyer entity
import { BuyerService } from './buyer.service'; // Import Buyer service
import { BuyerController } from './buyer.controller'; // Import Buyer controller

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
