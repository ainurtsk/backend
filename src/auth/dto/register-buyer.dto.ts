import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterBuyerDto {
  @IsNotEmpty({ message: 'Buyer name is required' })
  buyer_name: string; // Buyer's first name

  @IsNotEmpty({ message: 'Buyer surname is required' })
  buyer_surname: string; // Buyer's last name

  @IsEmail({}, { message: 'Invalid email format' })
  email: string; // Buyer's email address

  @IsNotEmpty({ message: 'Phone number is required' })
  phone_number: string; // Buyer's phone number

  @IsNotEmpty({ message: 'Address is required' })
  address: string; // Buyer's address

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string; // Buyer's password
}
