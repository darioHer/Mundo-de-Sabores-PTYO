import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('recetas')
export class RecetaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  ingredients: string;

  @Column()
  instructions: string;

  @Column()
  region: string; // Región de Colombia

  @ManyToOne(() => UsuarioEntity, usuario => usuario.recetas, { eager: true })
  usuario: UsuarioEntity;
  

}