import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateImagenDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsOptional()
    @IsNumber()
    recetaId?: number;

    @IsOptional()
    @IsNumber()
    productoId?: number;
}