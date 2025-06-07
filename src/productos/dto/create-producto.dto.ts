import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  regionId: number;

  @IsNumber()
  @IsPositive()
  stock: number;

}
