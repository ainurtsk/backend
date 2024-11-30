import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterFarmerDto {
  @IsNotEmpty()
  farmer_name: string;

  @IsNotEmpty()
  farmer_surname: string;

  @IsEmail()
  farmer_email: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  farm_location?: string; // Optional field

  @IsNotEmpty()
  @IsString()
  farm_name: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  gov_id: string;
}
