import { IsBoolean, IsNotEmpty, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductoDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  regionId?: number;

  @IsOptional()
  @IsBoolean()
  aprobado?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;

}
