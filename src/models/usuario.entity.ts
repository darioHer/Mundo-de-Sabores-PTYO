import { ComentarioEntity } from 'src/models/comentario.entity';
import { RolEntity } from 'src/models/rol.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { ProductoEntity } from 'src/models/producto.entity';
import {  Column,  Entity,  JoinColumn,  ManyToOne,  OneToMany,  PrimaryGeneratedColumn,  CreateDateColumn,  UpdateDateColumn,} from 'typeorm';
import { CalificacionEntity } from './calificacion.entity';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  nombres: string;

  @Column({ nullable: true })
  apellidos: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ type: 'text', nullable: true })
  biografia: string;

  @OneToMany(() => RecetaEntity, receta => receta.usuario)
  recetas: RecetaEntity[];

  @OneToMany(() => ProductoEntity, producto => producto.usuario)
  productos: ProductoEntity[];

  @OneToMany(() => ComentarioEntity, comentario => comentario.usuario)
  comentarios: ComentarioEntity[];

  @ManyToOne(() => RolEntity, rol => rol.usuarios)
  @JoinColumn({ name: 'rolId' })
  rol: RolEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CalificacionEntity, calificacion => calificacion.usuario)
calificaciones: CalificacionEntity[];

}
