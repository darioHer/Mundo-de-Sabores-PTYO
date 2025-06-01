// recetas.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from 'src/models/receta.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { CategoriaEntity } from 'src/models/categoria.entity';
import { RegionEntity } from 'src/models/region.entity';
import { ProductosModule } from 'src/productos/module/productos.module';
import { RecetasService } from '../service/recetas.service';
import { RecetasController } from '../controller/recetas.controller';
import { CalificacionEntity } from 'src/models/calificacion.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecetaEntity,
      UsuarioEntity,
      CategoriaEntity,
      RegionEntity,
      CalificacionEntity,
    ]),
    forwardRef(() => ProductosModule),
  ],
  controllers: [RecetasController],
  providers: [RecetasService],
  exports: [RecetasService],
})
export class RecetasModule {}
