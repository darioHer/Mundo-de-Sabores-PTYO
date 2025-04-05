import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateComentarioDto {
  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsNumber()
  recetaId?: number;

  @IsOptional()
  @IsNumber()
  usuarioId?: number;
}
