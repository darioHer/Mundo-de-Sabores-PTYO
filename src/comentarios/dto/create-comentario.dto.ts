import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  @IsNumber()
  recetaId: number;

  @IsNotEmpty()
  contenido: string;
}
