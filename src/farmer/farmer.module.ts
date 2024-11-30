import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './farmer.entity';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer])],
  controllers: [FarmerController],
  providers: [FarmerService],
  exports: [FarmerService],
})
export class FarmerModule {}
