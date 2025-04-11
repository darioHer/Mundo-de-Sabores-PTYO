import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { RecetaEntity } from 'src/recetas/entity/receta.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('comentarios')
export class ComentarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contenido: string;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.comentarios, { eager: true, onDelete: 'CASCADE' })
  usuario: UsuarioEntity;

  @ManyToOne(() => RecetaEntity, receta => receta.comentarios, { onDelete: 'CASCADE' })
  receta: RecetaEntity;
}
