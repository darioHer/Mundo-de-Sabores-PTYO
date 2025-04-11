import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioEntity } from './entity/comentario.entity';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { RecetaEntity } from 'src/recetas/entity/receta.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ComentarioEntity, UsuarioEntity,RecetaEntity])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}