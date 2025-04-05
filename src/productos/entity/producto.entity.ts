import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { CategoriaEntity } from 'src/categorias/entity/categoria.entity';
import { ImagenEntity } from 'src/imagenes/entity/imagen.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('productos')
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Nombre del producto

  @Column()
  description: string; // Descripción del producto

  @Column('decimal')
  price: number; // Precio del producto

  @Column()
  region: string; // Región de Colombia donde se vende el producto

  @ManyToOne(() => UsuarioEntity, usuario => usuario.productos, { eager: true })
  usuario: UsuarioEntity;

  @ManyToOne(() => CategoriaEntity, categoria => categoria.productos, { eager: true })
  categoria: CategoriaEntity;

  @OneToMany(() => ImagenEntity, imagen => imagen.producto, { cascade: true })
  imagenes: ImagenEntity[];

  

}