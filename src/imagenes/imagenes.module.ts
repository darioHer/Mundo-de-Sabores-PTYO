// src/imagenes/imagenes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagenEntity } from './entity/imagen.entity';
import { ImagenesController } from './imagenes.controller';
import { ImagenesService } from './imagenes.service';
import { RecetaEntity } from 'src/recetas/entity/receta.entity';
import { ProductoEntity } from 'src/productos/entity/producto.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ImagenEntity, RecetaEntity, ProductoEntity])],
    controllers: [ImagenesController],
    providers: [ImagenesService],
})
export class ImagenesModule {}
