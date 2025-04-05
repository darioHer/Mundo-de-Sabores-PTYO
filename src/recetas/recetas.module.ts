import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { RecetaEntity } from './entity/receta.entity';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';


@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity, UsuarioEntity])],
  controllers: [RecetasController],
  providers: [RecetasService],
})
export class RecetasModule {}
