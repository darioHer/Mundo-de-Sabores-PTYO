import { ComentarioEntity } from 'src/comentarios/entity/comentario.entity';
import { ProductoEntity } from 'src/productos/entity/producto.entity';
import { RecetaEntity } from 'src/recetas/entity/receta.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


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


}
