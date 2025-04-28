import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from 'src/categorias/module/categorias.module';
import { CategoriaEntity } from 'src/models/categoria.entity';
import { ComentarioEntity } from 'src/models/comentario.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { ProductosModule } from 'src/productos/module/productos.module';
import { RecetasController } from '../controller/recetas.controller';
import { RecetasService } from '../service/recetas.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecetaEntity,
      UsuarioEntity,
      ComentarioEntity,
      CategoriaEntity,
    ]),
    CategoriasModule,
    forwardRef(() => ProductosModule),
  ],
  controllers: [RecetasController],
  providers: [RecetasService],
  exports: [RecetasService],
})
export class RecetasModule {}