import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('buyer') // Table name in the database
@Unique(['email', 'phone_number']) // Ensures email and phone are unique
export class Buyer {
  @PrimaryGeneratedColumn()
  buyer_id: number; // Primary Key (inherently unique)

  @Column({ length: 100 })
  buyer_name: string; // Buyer's first name

  @Column({ length: 100 })
  buyer_surname: string; // Buyer's last name

  @Column({ length: 100 })
  email: string; // Buyer's email (must be unique)

  @Column({ length: 15 })
  phone_number: string; // Buyer's phone number (must be unique)

  @Column('text')
  address: string; // Buyer's address

  @Column()
  password: string; // Buyer's hashed password
}
