import { IsInt, Min, Max } from 'class-validator';

export class CalificarRecetaDto {
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion: number;
}