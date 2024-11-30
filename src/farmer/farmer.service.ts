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
    await this.farmerRepository.update(id, updateData);
    return this.farmerRepository.findOne({ where: { farmer_id: id } });
  }

  async delete(id: number): Promise<void> {
    await this.farmerRepository.delete(id);
  }
}
