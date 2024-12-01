import { IsString, IsNotEmpty, IsNumber, Min, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  product_description: string;

  @IsNumber()
  @Min(0)
  product_price: number;

  @IsNumber()
  @Min(0)
  product_quantity: number;

  @IsString()
  @IsIn(['Vegetables', 'Fruits', 'Seeds', 'Equipment'])
  product_category: string;
}
