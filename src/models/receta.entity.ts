import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { CategoriaEntity } from './categoria.entity';
import { ComentarioEntity } from './comentario.entity';
import { RegionEntity } from './region.entity';
import { CalificacionEntity } from './calificacion.entity';

@Entity('recetas')
export class RecetaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  ingredients: string;

  @Column()
  instructions: string;

  @Column({ default: false })
  aprobado: boolean;

  @Column({ nullable: true })
  imagenUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'float', default: 0 })
  promedioCalificacion: number;

  @Column({ type: 'int', default: 0 })
  totalCalificaciones: number;

  @Column({ type: 'int', default: 0 })
  cantidadCalificaciones: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.recetas, { eager: true })
  usuario: UsuarioEntity;

  @ManyToOne(() => CategoriaEntity, categoria => categoria.recetas, { eager: true })
  categoria: CategoriaEntity;

  @OneToMany(() => ComentarioEntity, comentario => comentario.receta, { cascade: true })
  comentarios: ComentarioEntity[];

  @ManyToOne(() => RegionEntity, region => region.recetas)
  region: RegionEntity;

  @OneToMany(() => CalificacionEntity, calificacion => calificacion.receta)
  calificaciones: CalificacionEntity[];
}
