import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecetaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  ingredients: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  regionId: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  categoriaId: number;

  @IsOptional()
  @Type(() => Number)
  latitud?: number;

  @IsOptional()
  @Type(() => Number)
  longitud?: number;

}
