import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';


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
}