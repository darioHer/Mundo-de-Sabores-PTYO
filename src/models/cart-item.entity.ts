import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductoEntity } from './producto.entity';

@Entity()
export class CarritoItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => CartEntity, cart => cart.items)
    carrito: CartEntity;

    @ManyToOne(() => ProductoEntity, producto => producto.carritoItems)
    producto: ProductoEntity;
}