import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RecetaEntity } from './receta.entity';

@Entity('regiones')
export class RegionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @OneToMany(() => RecetaEntity, receta => receta.region)
    recetas: RecetaEntity[];
}