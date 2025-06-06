import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { CarritoItem } from "./cart-item.entity";

@Entity('carritos')
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.carritos)
    usuario: UsuarioEntity;

    @OneToMany(() => CarritoItem, (item) => item.carrito, { cascade: true })
    items: CarritoItem[];
}
