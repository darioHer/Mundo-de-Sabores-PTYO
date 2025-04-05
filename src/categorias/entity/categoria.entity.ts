// src/categorias/entity/categoria.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecetaEntity } from '../../recetas/entity/receta.entity';
import { ProductoEntity } from '../../productos/entity/producto.entity';

@Entity('categorias')
export class CategoriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => RecetaEntity, receta => receta.categoria)
  recetas: RecetaEntity[];

  @OneToMany(() => ProductoEntity, producto => producto.categoria)
  productos: ProductoEntity[];
}
