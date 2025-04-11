import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { RecetaEntity } from './entity/receta.entity';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { ComentarioEntity } from 'src/comentarios/entity/comentario.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { CategoriaEntity } from 'src/categorias/entity/categoria.entity';


@Module({
  imports: [TypeOrmModule.forFeature([
    RecetaEntity, UsuarioEntity,ComentarioEntity,CategoriaEntity]),CategoriasModule],

  controllers: [RecetasController],
  providers: [RecetasService],
})
export class RecetasModule {}
