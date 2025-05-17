import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductoDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  region?: string;

  @IsOptional()
  @IsBoolean()
  aprobado?: boolean;

}