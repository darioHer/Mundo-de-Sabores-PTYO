import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecetaEntity } from 'src/models/receta.entity';
import { ProductoEntity } from './producto.entity';

@Entity('categorias')
export class CategoriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => RecetaEntity, receta => receta.categoria)
  recetas: RecetaEntity[];

  @OneToMany(() => ProductoEntity, producto => producto.categoria)
  productos: ProductoEntity[];
}
