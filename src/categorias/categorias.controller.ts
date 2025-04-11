import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';


@Controller('categorias')
export class CategoriasController {
constructor(private readonly categoriasService: CategoriasService) {}

@Post()
create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
}

@Get()
findAll() {
    return this.categoriasService.findAll();
}

@Get(':id')
findOne(@Param('id') id: number) {
    return this.categoriasService.findOne(+id);
}

@Put(':id')
update(@Param('id') id: number, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(+id, dto);
}

@Delete(':id')
remove(@Param('id') id: number) {
    return this.categoriasService.remove(+id);
}
}
