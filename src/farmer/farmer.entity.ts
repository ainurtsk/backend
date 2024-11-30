import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('farmer') // Table name in the database
@Unique(['farmer_email', 'phone_number']) // Ensures email and phone are unique
export class Farmer {
  @PrimaryGeneratedColumn()
  farmer_id: number; // Primary Key (inherently unique)

  @Column({ length: 100 })
  farmer_name: string; // Farmer's first name

  @Column({ length: 100 })
  farmer_surname: string; // Farmer's last name

  @Column({ length: 100 })
  farmer_email: string; // Farmer's email (must be unique)

  @Column({ length: 15 })
  phone_number: string; // Farmer's phone number (must be unique)

  @Column({ length: 255, nullable: true })
  farm_location?: string; // Optional field for the farm's location

  @Column()
  password: string; // Farmer's hashed password
}
