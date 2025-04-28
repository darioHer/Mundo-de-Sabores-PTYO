import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from 'src/models/receta.entity';
import { CategoriaEntity } from '../../models/categoria.entity';
import { CategoriasService } from '../service/categorias.service';
import { CategoriasController } from '../controller/categorias.controller';


@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity,RecetaEntity])],
  providers: [CategoriasService],
  controllers: [CategoriasController],
  exports: [CategoriasService,], 
})
export class CategoriasModule {}
