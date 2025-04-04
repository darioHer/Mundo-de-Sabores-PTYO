import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios') 
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ unique: true })
  username: string; 

  @Column()
  password: string; 

  @Column({ unique: true })
  email: string; 
}