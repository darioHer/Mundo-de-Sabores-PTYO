import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  recetaId: number; 

  @IsNotEmpty()
  contenido: string; 

  @IsNumber()
  usuarioId: number;
}