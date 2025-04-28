import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateRecetaDto } from '../dto/create-receta.dto';
import { UpdateRecetaDto } from '../dto/update-receta.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { RecetaEntity } from 'src/models/receta.entity';
import { RecetasService } from '../service/recetas.service';
import { AutorOrAdminGuard } from 'src/auth/guard/autor-or-admin.guard';

@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRecetaDto: CreateRecetaDto, @Req() req) {
    const usuarioId = req.user.id;
    return this.recetasService.create(createRecetaDto, usuarioId);
  }

  @Get()
  async findAll(): Promise<RecetaEntity[]> {
    return this.recetasService.findAll();
  }

  @Get('destacadas') 
  async getDestacadas(): Promise<RecetaEntity[]> {
    return this.recetasService.findDestacadas();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecetaDto: UpdateRecetaDto,
  ) {
    return this.recetasService.update(id, updateRecetaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.remove(id);
  }
  @Patch(':id/aprobar')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async aprobarReceta(@Param('id', ParseIntPipe) id: number) {
  return this.recetasService.aprobar(id);
}

}
