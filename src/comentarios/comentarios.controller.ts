import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { ComentarioEntity } from './entity/comentario.entity';


@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  async create(@Body() createComentarioDto: CreateComentarioDto) {
    return await this.comentariosService.create(createComentarioDto);
  }

  @Get()
  async findAll() {
    return await this.comentariosService.findAll();
  }
  @Put(':id') 
  async update(@Param('id') id: number, @Body() updateComentarioDto: CreateComentarioDto): Promise<ComentarioEntity> {
    return await this.comentariosService.update(id, updateComentarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.comentariosService.remove(id);
  }

  
}