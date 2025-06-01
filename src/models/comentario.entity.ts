import { UsuarioEntity } from 'src/models/usuario.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecetaEntity } from './receta.entity';

@Entity('comentarios')
export class ComentarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contenido: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.comentarios, { eager: true, onDelete: 'CASCADE' })
  usuario: UsuarioEntity;

  @ManyToOne(() => RecetaEntity, receta => receta.comentarios, { onDelete: 'CASCADE' })
  receta: RecetaEntity;
}
