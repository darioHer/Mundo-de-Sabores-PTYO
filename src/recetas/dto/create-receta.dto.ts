import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRecetaDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  ingredients: string;

  @IsNotEmpty()
  instructions: string;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

  @IsNotEmpty()
  region: string; 

  
  @IsNotEmpty()
  @IsNumber()
  categoriaId: number;
}