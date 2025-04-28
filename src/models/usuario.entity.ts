import { ComentarioEntity } from 'src/models/comentario.entity';
import { RolEntity } from 'src/models/rol.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from 'src/models/producto.entity';


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


  @OneToMany(() => RecetaEntity, receta => receta.usuario)
  recetas: RecetaEntity[];

  @OneToMany(() => ProductoEntity, producto => producto.usuario)
  productos: ProductoEntity[];

  @OneToMany(() => ComentarioEntity, comentario => comentario.usuario)
  comentarios: ComentarioEntity[];





  @ManyToOne(() => RolEntity, rol => rol.usuarios)
  @JoinColumn({ name: 'rolId' })
  rol: RolEntity;


}
