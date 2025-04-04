import { IsNotEmpty } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  name: string; // Nombre del producto

  @IsNotEmpty()
  description: string; // Descripción del producto

  @IsNotEmpty()
  price: number; // Precio del producto

  @IsNotEmpty()
  region: string; // Región de Colombia donde se vende el producto
}