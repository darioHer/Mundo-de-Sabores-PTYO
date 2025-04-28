import { UsuarioEntity } from 'src/models/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecetaEntity } from './receta.entity';

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
