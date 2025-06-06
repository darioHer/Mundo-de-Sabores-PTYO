import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartEntity } from "src/models/cart.entity";
import { CarritoItem } from "src/models/cart-item.entity";
import { ProductoEntity } from "src/models/producto.entity";
import { AddToCartDto } from "./dto/add-to-cart.dto";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepo: Repository<CartEntity>,

        @InjectRepository(CarritoItem)
        private readonly itemRepo: Repository<CarritoItem>,

        @InjectRepository(ProductoEntity)
        private readonly productoRepo: Repository<ProductoEntity>
    ) { }

    /**
     * Busca o crea un carrito para el usuario.
     */
    async getOrCreateCart(userId: number): Promise<CartEntity> {
        let cart = await this.cartRepo.findOne({
            where: { usuario: { id: userId } },
            relations: ['items', 'items.producto'],
        });

        if (!cart) {
            cart = this.cartRepo.create({ usuario: { id: userId } });
            await this.cartRepo.save(cart);
        }

        return cart;
    }

    /**
     * Agrega un producto al carrito del usuario.
     */
    async addItem(userId: number, dto: AddToCartDto): Promise<CarritoItem> {
        const cart = await this.getOrCreateCart(userId);
        const producto = await this.productoRepo.findOne({ where: { id: dto.productoId } });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        let item = await this.itemRepo.findOne({
            where: {
                carrito: { id: cart.id },
                producto: { id: dto.productoId },
            },
        });

        if (item) {
            item.quantity += dto.quantity;
        } else {
            item = this.itemRepo.create({
                carrito: cart,
                producto,
                quantity: dto.quantity,
            });
        }

        return await this.itemRepo.save(item);
    }

    /**
     * Obtiene el carrito actual del usuario con todos los ítems.
     */
    async getCart(userId: number): Promise<CartEntity> {
        return await this.getOrCreateCart(userId);
    }

    /**
     * Elimina un ítem específico del carrito del usuario.
     */
    async removeItem(userId: number, itemId: number): Promise<void> {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.itemRepo.findOne({
            where: { id: itemId, carrito: { id: cart.id } },
        });

        if (!item) {
            throw new NotFoundException('Ítem no encontrado');
        }

        await this.itemRepo.remove(item);
    }

    /**
     * Elimina todos los ítems del carrito del usuario.
     */
    async clearCart(userId: number): Promise<void> {
        const cart = await this.getOrCreateCart(userId);
        await this.itemRepo.delete({ carrito: { id: cart.id } });
    }
}
