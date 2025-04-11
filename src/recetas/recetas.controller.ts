import {  Controller,  Get,  Post,  Body,  Param,  Put,  Delete,  Req,} from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';


@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  async create(@Body() createRecetaDto: CreateRecetaDto) {
    return this.recetasService.create(createRecetaDto);
  }

  @Get()
  async findAll() {
    return this.recetasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recetasService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecetaDto: UpdateRecetaDto,
  ) {
    return this.recetasService.update(Number(id), updateRecetaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.recetasService.remove(Number(id));
  }




}
