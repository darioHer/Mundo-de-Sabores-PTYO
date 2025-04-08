import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from './entity/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  providers: [CategoriasService],
  controllers: [CategoriasController],
  exports: [CategoriasService], 
})
export class CategoriasModule {}
