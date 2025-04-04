import { IsNotEmpty } from 'class-validator';

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
  region: string; // Región de Colombia
}