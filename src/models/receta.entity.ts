import { CategoriaEntity } from 'src/models/categoria.entity';
import { ComentarioEntity } from 'src/models/comentario.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


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

  @Column()
  region: string; // Región de Colombia

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






  

}