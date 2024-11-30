import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { Farmer } from './farmer.entity';

@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get()
  async findAll(): Promise<Farmer[]> {
    return this.farmerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Farmer> {
    return this.farmerService.findOne(id);
  }

  @Post()
  async create(@Body() farmer: Partial<Farmer>): Promise<Farmer> {
    return this.farmerService.create(farmer);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<Farmer>,
  ): Promise<Farmer> {
    return this.farmerService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.farmerService.delete(id);
  }
}
