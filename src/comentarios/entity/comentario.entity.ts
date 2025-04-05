import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('comentarios')
export class ComentarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recetaId: number; 

  @Column()
  contenido: string; 

  @ManyToOne(() => UsuarioEntity, usuario => usuario.comentarios, { eager: true, onDelete: 'CASCADE' })
  usuario: UsuarioEntity;
}