import { IsString, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  product_name?: string;

  @IsString()
  @IsOptional()
  product_description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  product_price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  product_quantity?: number;

  @IsString()
  @IsOptional()
  @IsIn(['Vegetables', 'Fruits', 'Seeds', 'Equipment'])
  product_category?: string;
}
