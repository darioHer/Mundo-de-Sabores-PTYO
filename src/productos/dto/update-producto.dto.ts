import { IsOptional, IsNotEmpty } from 'class-validator';

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
}