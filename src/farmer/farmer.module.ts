import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './farmer.entity'; // Import the Farmer entity
import { FarmerService } from './farmer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer])], // Register Farmer entity in TypeOrm
  providers: [FarmerService],
  exports: [FarmerService], // Export TypeOrmModule so other modules can access FarmerRepository
})
export class FarmerModule {}
