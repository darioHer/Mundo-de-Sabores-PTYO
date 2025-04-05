
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { RecetaEntity } from './receta.entity';

@Entity('calificaciones')
@Unique(['usuario', 'receta']) // Para que un usuario califique una sola vez cada receta
export class CalificacionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 1 })
  puntuacion: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.calificaciones, { onDelete: 'CASCADE' })
  usuario: UsuarioEntity;

  @ManyToOne(() => RecetaEntity, receta => receta.calificaciones, { onDelete: 'CASCADE' })
  receta: RecetaEntity;
}
