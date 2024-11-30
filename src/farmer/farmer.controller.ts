import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { Farmer } from './farmer.entity';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

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

  @Patch('/profile/:id')
  async update(
    @Param('id') id: number,
    @Body() updateData: UpdateFarmerDto,
  ): Promise<Farmer> {
    return this.farmerService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.farmerService.delete(id);
  }
}
