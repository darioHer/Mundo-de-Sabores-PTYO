// src/recetas/entity/usuario_receta_favorita.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { RecetaEntity } from '../entity/receta.entity';


@Entity('usuario_receta_favorita')
@Unique(['usuario', 'receta'])
export class UsuarioRecetaFavoritaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.favoritos, { onDelete: 'CASCADE' })
  usuario: UsuarioEntity;

  @ManyToOne(() => RecetaEntity, receta => receta.favoritos, { onDelete: 'CASCADE' })
  receta: RecetaEntity;
}
