import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { CategoriaEntity } from "./categoria.entity";
import { ComentarioEntity } from "./comentario.entity";
import { RegionEntity } from "./region.entity";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.recetas, { eager: true })
  usuario: UsuarioEntity;

  @ManyToOne(() => CategoriaEntity, categoria => categoria.recetas, { eager: true })
  categoria: CategoriaEntity;

  @OneToMany(() => ComentarioEntity, comentario => comentario.receta, { cascade: true })
  comentarios: ComentarioEntity[];

  @ManyToOne(() => RegionEntity, region => region.recetas)
  region: RegionEntity;
}
