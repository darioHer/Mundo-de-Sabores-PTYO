import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './entity/receta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
  controllers: [RecetasController],
  providers: [RecetasService],
})
export class RecetasModule {}