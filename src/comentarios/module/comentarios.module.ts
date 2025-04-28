import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from 'src/models/receta.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { ComentarioEntity } from '../../models/comentario.entity';
import { ComentariosService } from '../service/comentarios.service';
import { ComentariosController } from '../controller/comentarios.controller';



@Module({
  imports: [TypeOrmModule.forFeature([ComentarioEntity, UsuarioEntity,RecetaEntity])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}