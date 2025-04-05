import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  name: string; 

  @IsNotEmpty()
  description: string; 

  @IsNotEmpty()
  price: number; 

  @IsNotEmpty()
  region: string; 

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

}