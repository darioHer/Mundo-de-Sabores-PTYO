import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}