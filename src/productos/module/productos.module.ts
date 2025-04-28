import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { RecetasModule } from 'src/recetas/module/recetas.module';
import { ProductoEntity } from '../../models/producto.entity';
import { ProductosController } from '../controller/productos.controller';
import { ProductosService } from '../service/productos.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoEntity, UsuarioEntity]),
    forwardRef(() => RecetasModule), // ✅ necesario para que AutorOrAdminGuard funcione
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}