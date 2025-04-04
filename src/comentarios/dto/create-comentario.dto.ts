import { IsNotEmpty } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  recetaId: number; // ID de la receta a la que pertenece el comentario

  @IsNotEmpty()
  content: string; // Contenido del comentario
}