import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { Buyer } from './buyer.entity';
import { ProductService } from '../product/product.service';

@Controller('buyers')
export class BuyerController {
  constructor(
    private readonly productService: ProductService, // Inject ProductService
    private readonly buyerService: BuyerService,
  ) {}

  @Get()
  async findAll(): Promise<Buyer[]> {
    return this.buyerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Buyer> {
    return this.buyerService.findOne(id);
  }

  @Post()
  async create(@Body() buyer: Partial<Buyer>): Promise<Buyer> {
    return this.buyerService.create(buyer);
  }

  @Get('categories')
  async getCategoriesForBuyer(): Promise<string[]> {
    // Fetch the unique categories for buyers
    return this.productService.findUniqueCategories();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<Buyer>,
  ): Promise<Buyer> {
    return this.buyerService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.buyerService.delete(id);
  }
}
