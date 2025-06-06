import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/module/auth.module";
import { CarritoItem } from "src/models/cart-item.entity";
import { ProductoEntity } from "src/models/producto.entity";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
    imports: [TypeOrmModule.forFeature([CartModule, CarritoItem, ProductoEntity]), AuthModule],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule { }