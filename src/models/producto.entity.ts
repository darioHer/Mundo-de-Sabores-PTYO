import { CategoriaEntity } from 'src/models/categoria.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { RegionEntity } from 'src/models/region.entity'; // asegúrate de importar correctamente

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarritoItem } from './cart-item.entity';

@Entity('productos')
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;


  @Column({ default: false })
  aprobado: boolean;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.productos, { eager: true })
  usuario: UsuarioEntity;

  @ManyToOne(() => CategoriaEntity, categoria => categoria.productos, { eager: true })
  categoria: CategoriaEntity;

  @ManyToOne(() => RegionEntity, region => region.productos, { eager: true })
  region: RegionEntity;

  @OneToMany(() => CarritoItem, item => item.producto)
  carritoItems: CarritoItem[];



}
