import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
    ParseIntPipe,
    HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    /**
     * Agrega un producto al carrito del usuario autenticado
     */
    @Post('add')
    async addItem(@Req() req: Request, @Body() dto: AddToCartDto) {
        const userId = req.user?.['id'];
        if (!userId) {
            throw new Error('User ID is undefined');
        }
        return this.cartService.addItem(userId, dto);
    }

    /**
     * Obtiene el carrito completo del usuario autenticado
     */
    @Get()
    async getCart(@Req() req: Request) {
        const userId = req.user?.['id'];
        if (!userId) {
            throw new Error('User ID is undefined');
        }
        return this.cartService.getCart(userId);
    }

    /**
     * Elimina un ítem específico del carrito
     */
    @Delete(':itemId')
    @HttpCode(204)
    async removeItem(
        @Req() req: Request,
        @Param('itemId', ParseIntPipe) itemId: number,
    ) {
        const userId = req.user?.['id'];
        if (!userId) {
            throw new Error('User ID is undefined');
        }
        await this.cartService.removeItem(userId, itemId);
    }

    /**
     * Vacía el carrito del usuario autenticado
     */
    @Delete()
    @HttpCode(204)
    async clearCart(@Req() req: Request) {
        const userId = req.user?.['id'];
        if (!userId) {
            throw new Error('User ID is undefined');
        }
        await this.cartService.clearCart(userId);
    }
}
