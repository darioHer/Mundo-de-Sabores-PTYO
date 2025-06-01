import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioEntity } from 'src/models/comentario.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { RecetasModule } from 'src/recetas/module/recetas.module';
import { ComentariosController } from '../controller/comentarios.controller';
import { ComentariosService } from '../service/comentarios.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ComentarioEntity, UsuarioEntity, RecetaEntity]),
    forwardRef(() => RecetasModule), 
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService],
})
export class ComentariosModule {}
