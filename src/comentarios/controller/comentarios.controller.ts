import {  Body,  Controller,  Delete,  Get,  Param,  ParseIntPipe,  Post,  Put,  UseGuards,} from '@nestjs/common';


import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { ComentariosService } from '../service/comentarios.service';
import { CreateComentarioDto } from '../dto/create-comentario.dto';
import { ComentarioEntity } from 'src/models/comentario.entity';
import { UpdateComentarioDto } from '../dto/update-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('usuario', 'admin')
  async create(@Body() createComentarioDto: CreateComentarioDto): Promise<ComentarioEntity> {
    return await this.comentariosService.create(createComentarioDto);
  }

  @Get()
  async findAll(): Promise<ComentarioEntity[]> {
    return await this.comentariosService.findAll();
  }

  @Get('recientes') 
  async getRecientes(): Promise<ComentarioEntity[]> {
    return await this.comentariosService.findRecientes();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComentarioDto: UpdateComentarioDto,
  ): Promise<ComentarioEntity> {
    return await this.comentariosService.update(id, updateComentarioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.comentariosService.remove(id);
  }
}
