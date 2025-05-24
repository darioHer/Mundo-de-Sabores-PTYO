import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { RegionService } from './regiones.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Controller('regiones')
export class RegionController {
    constructor(private readonly regionService: RegionService) { }

    /**
     * Crear nueva región (solo admin)
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async create(@Body() dto: CreateRegionDto) {
        return await this.regionService.create(dto);
    }

    /**
     * Obtener todas las regiones con sus recetas asociadas
     */
    @Get()
    async findAll() {
        return await this.regionService.findAll();
    }

    /**
     * Obtener detalles de una región por ID
     */
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.regionService.findOne(id);
    }

    /**
     * Obtener recetas asociadas a una región específica
     */
    @Get(':id/recetas')
    async findRecetas(@Param('id', ParseIntPipe) id: number) {
        return await this.regionService.findRecetasByRegion(id);
    }

    /**
     * Actualizar una región (solo admin)
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRegionDto,
    ) {
        return await this.regionService.update(id, dto);
    }

    /**
     * Eliminar una región (solo admin)
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.regionService.remove(id);
    }
}
