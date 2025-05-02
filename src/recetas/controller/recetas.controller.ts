import {  Body,  Controller,  Delete,  Get,  Param, ParseIntPipe,  Patch,  Post,  Put,  Req,  UseGuards,} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AutorOrAdminGuard } from 'src/auth/guard/autor-or-admin.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { CreateRecetaDto } from '../dto/create-receta.dto';
import { UpdateRecetaDto } from '../dto/update-receta.dto';
import { RecetaEntity } from 'src/models/receta.entity';
import { RecetasService } from '../service/recetas.service';

@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateRecetaDto, @Req() req) {
    const usuarioId = req.user.id;
    const rol = req.user.rol; 
    return this.recetasService.create(dto, usuarioId, rol);
  }
  

  @Get()
  async findAll(): Promise<RecetaEntity[]> {
    return this.recetasService.findAll();
  }

  @Get('destacadas')
  async getDestacadas(): Promise<RecetaEntity[]> {
    return this.recetasService.findDestacadas();
  }


  @Get('mis-recetas')
  @UseGuards(JwtAuthGuard)
  async getMisRecetas(@Req() req): Promise<RecetaEntity[]> {
    const usuarioId = req.user.id;
    const { aprobadas, pendientes } = await this.recetasService.findByUsuario(usuarioId);
    return [...aprobadas, ...pendientes];
  }

  @Get('pendientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getPendientes(): Promise<RecetaEntity[]> {
    return this.recetasService.findPendientes();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecetaDto,
  ) {
    return this.recetasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const usuarioId = req.user.id;
    const rol = req.user.rol;
    return this.recetasService.remove(id, usuarioId, rol);
  }
  

  @Patch(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async aprobarReceta(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.aprobar(id);
  }
}
