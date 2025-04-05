import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RecetaEntity } from 'src/recetas/entity/receta.entity';
import { ProductoEntity } from 'src/productos/entity/producto.entity';

@Entity('imagenes')
export class ImagenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => RecetaEntity, receta => receta.imagenes, { nullable: true, onDelete: 'CASCADE' })
    receta: RecetaEntity;

    @ManyToOne(() => ProductoEntity, producto => producto.imagenes, { nullable: true, onDelete: 'CASCADE' })
    producto: ProductoEntity;
}