import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmer } from './farmer.entity';

@Injectable()
export class FarmerService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) {}

  async findAll(): Promise<Farmer[]> {
    return this.farmerRepository.find();
  }

  async findOne(id: number): Promise<Farmer> {
    return this.farmerRepository.findOne({ where: { farmer_id: id } });
  }

  async create(farmer: Partial<Farmer>): Promise<Farmer> {
    const newFarmer = this.farmerRepository.create(farmer);
    return this.farmerRepository.save(newFarmer);
  }

  async update(id: number, updateData: Partial<Farmer>): Promise<Farmer> {
    const farmer = await this.farmerRepository.findOne({
      where: { farmer_id: id },
    });

    if (!farmer) {
      throw new Error('Farmer not found'); // You can also use a specific Exception
    }

    // Merge the updateData into the existing farmer entity
    for (const key in updateData) {
      if (updateData[key] !== undefined) {
        farmer[key] = updateData[key];
      }
    }

    // Save the updated farmer
    return this.farmerRepository.save(farmer);
  }

  async delete(id: number): Promise<void> {
    await this.farmerRepository.delete(id);
  }
}
