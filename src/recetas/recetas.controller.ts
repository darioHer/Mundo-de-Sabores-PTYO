import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { CalificarRecetaDto } from './dto/calificar-receta.dto';


@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  async create(@Body() createRecetaDto: CreateRecetaDto) {
    return await this.recetasService.create(createRecetaDto);
  }

  @Get()
  async findAll() {
    return await this.recetasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.recetasService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRecetaDto: UpdateRecetaDto) {
    return await this.recetasService.update(id, updateRecetaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.recetasService.remove(id);
  }

  @Post(':id/favoritos')
async marcarFavorito(
  @Param('id') recetaId: number,
  @Req() req: any,
) {
  return this.recetasService.marcarFavorito(recetaId, req.user.sub);
}

@Get('/usuarios/:id/favoritos')
async getFavoritos(@Param('id') usuarioId: number) {
  return this.recetasService.obtenerFavoritosPorUsuario(usuarioId);
}
@Post(':id/calificar')
async calificar(
  @Param('id') recetaId: number,
  @Req() req: any,
  @Body() dto: CalificarRecetaDto,
) {
  return this.recetasService.calificarReceta(recetaId, req.user.sub, dto);
}
}