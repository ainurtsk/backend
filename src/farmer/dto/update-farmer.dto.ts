import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateFarmerDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  farmer_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  farmer_surname?: string;

  @IsOptional()
  @IsString()
  @Length(10, 15)
  phone_number?: string;

  @IsOptional()
  @IsString()
  crops?: string;

  @IsOptional()
  @IsString()
  product_image?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  farm_location?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  farm_name?: string;
}
