import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { ProductoEntity } from './producto.entity'; // nuevo import

@Entity('regiones')
export class RegionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @OneToMany(() => RecetaEntity, receta => receta.region)
    recetas: RecetaEntity[];

    @OneToMany(() => ProductoEntity, producto => producto.region)
    productos: ProductoEntity[];
}
