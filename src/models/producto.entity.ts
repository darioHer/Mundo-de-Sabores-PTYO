import { CategoriaEntity } from 'src/models/categoria.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productos')
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;  // Nombre del producto

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





}