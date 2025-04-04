import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comentarios')
export class ComentarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recetaId: number; // ID de la receta a la que pertenece el comentario

  @Column()
  content: string; // Contenido del comentario
}