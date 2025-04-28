import { UsuarioEntity } from 'src/models/usuario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RolEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;



  
  @OneToMany(() => UsuarioEntity, usuario => usuario.rol)
  usuarios: UsuarioEntity[];

}