import { IsNumber, Min, Max } from 'class-validator';

export class CalificarRecetaDto {
    @IsNumber()
    @Min(0.5)
    @Max(5)
    calificacion: number;
}