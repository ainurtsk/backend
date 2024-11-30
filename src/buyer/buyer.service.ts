import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from './buyer.entity';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
  ) {}

  async findAll(): Promise<Buyer[]> {
    return this.buyerRepository.find();
  }

  async findOne(id: number): Promise<Buyer> {
    return this.buyerRepository.findOne({ where: { buyer_id: id } });
  }

  async create(data: Partial<Buyer>): Promise<Buyer> {
    const newBuyer = this.buyerRepository.create(data);
    return this.buyerRepository.save(newBuyer);
  }

  async update(id: number, updateData: Partial<Buyer>): Promise<Buyer> {
    await this.buyerRepository.update(id, updateData);
    return this.buyerRepository.findOne({ where: { buyer_id: id } });
  }

  async delete(id: number): Promise<void> {
    await this.buyerRepository.delete(id);
  }
}
