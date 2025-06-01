import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { ComentariosService } from '../service/comentarios.service';
import { CreateComentarioDto } from '../dto/create-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateComentarioDto, @Req() req) {
    const userId = req.user.id;
    return this.comentariosService.create(dto, userId);
  }

  @Get(':recetaId')
  async getByReceta(@Param('recetaId', ParseIntPipe) recetaId: number) {
    return this.comentariosService.findByReceta(recetaId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll() {
    return this.comentariosService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const { id: userId, rol } = req.user;
    return this.comentariosService.delete(id, userId, rol);
  }
}
