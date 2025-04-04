import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioEntity } from './entity/comentario.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ComentarioEntity])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}