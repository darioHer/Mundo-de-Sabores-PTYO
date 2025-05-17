import { IsNotEmpty } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  name: string; 

  @IsNotEmpty()
  description: string; 

  @IsNotEmpty()
  price: number; 

  @IsNotEmpty()
  region: string; 



}