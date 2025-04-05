import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entity/producto.entity';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, UsuarioEntity])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}