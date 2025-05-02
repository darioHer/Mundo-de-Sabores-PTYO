import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRecetaDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  ingredients?: string;

  @IsOptional()
  @IsNotEmpty()
  instructions?: string;

  @IsOptional()
  @IsNotEmpty()
  region?: string;

  @IsOptional()
  @IsNumber()
  categoriaId?: number;
}
