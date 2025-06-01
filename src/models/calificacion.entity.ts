import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { RecetaEntity } from './receta.entity';

@Entity('calificaciones')
export class CalificacionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    calificacion: number;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.calificaciones, { eager: true, onDelete: 'CASCADE' })
    usuario: UsuarioEntity;

    @ManyToOne(() => RecetaEntity, (receta) => receta.calificaciones, { eager: true, onDelete: 'CASCADE' })
    receta: RecetaEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
