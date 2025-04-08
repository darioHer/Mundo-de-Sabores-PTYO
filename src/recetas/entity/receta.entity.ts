import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsuarioRecetaFavoritaEntity } from '../favoritos/usuario_receta_favorita.entity';
import { CalificacionEntity } from './calificacion.entity';
import { CategoriaEntity } from 'src/categorias/entity/categoria.entity';

@Entity('recetas')
export class RecetaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  ingredients: string;

  @Column()
  instructions: string;

  @Column()
  region: string; // Región de Colombia

  @ManyToOne(() => UsuarioEntity, usuario => usuario.recetas, { eager: true })
  usuario: UsuarioEntity;

  @OneToMany(() => UsuarioRecetaFavoritaEntity, favorito => favorito.receta)
  favoritos: UsuarioRecetaFavoritaEntity[];

  @OneToMany(() => CalificacionEntity, calificacion => calificacion.receta)
  calificaciones: CalificacionEntity[];

  @ManyToOne(() => CategoriaEntity, categoria => categoria.recetas, { eager: true })
  categoria: CategoriaEntity;





  

}