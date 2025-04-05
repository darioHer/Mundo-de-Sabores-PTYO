import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { RecetaEntity } from './entity/receta.entity';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { UsuarioRecetaFavoritaEntity } from './favoritos/usuario_receta_favorita.entity';
import { CalificacionEntity } from './entity/calificacion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity, UsuarioEntity,UsuarioRecetaFavoritaEntity,CalificacionEntity])],
  controllers: [RecetasController],
  providers: [RecetasService],
})
export class RecetasModule {}
