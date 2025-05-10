import {    Body,    Controller,    Delete,    Get,    Param,    Post,    Put,    UseGuards,    ParseIntPipe,} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { CategoriasService } from '../service/categorias.service';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    /**
     * Crear nueva categoría (solo admin)
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async create(@Body() dto: CreateCategoriaDto) {
        return await this.categoriasService.create(dto);
    }

    /**
     * Obtener todas las categorías con sus recetas asociadas
     */
    @Get()
    async findAll() {
        return await this.categoriasService.findAll();
    }

    /**
     * Obtener detalles de una categoría por ID
     */
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriasService.findOne(id);
    }

    /**
     * Obtener recetas asociadas a una categoría específica
     */
    @Get(':id/recetas')
    async findRecetas(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriasService.findRecetasByCategoria(id);
    }

    /**
     * Actualizar información de una categoría (solo admin)
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoriaDto,
    ) {
        return await this.categoriasService.update(id, dto);
    }

    /**
     * Eliminar una categoría (solo admin)
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriasService.remove(id);
    }
}
