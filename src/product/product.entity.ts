import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Farmer } from '../farmer/farmer.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @ManyToOne(() => Farmer, (farmer) => farmer.products)
  @JoinColumn({ name: 'farmerId' }) // Ensure you have this join column
  farmer: Farmer;

  @Column({ length: 100 })
  product_name: string;

  @Column('text')
  product_description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  product_price: number;

  @Column('int')
  product_quantity: number;

  @Column({ length: 255, nullable: true })
  product_image?: string;

  @Column({
    type: 'enum',
    enum: ['Vegetables', 'Fruits', 'Seeds', 'Equipment'],
  })
  product_category: string;
}
