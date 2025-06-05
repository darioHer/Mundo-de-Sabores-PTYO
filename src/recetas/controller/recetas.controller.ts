import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AutorOrAdminGuard } from 'src/auth/guard/autor-or-admin.guard';
import { Roles } from 'src/decorator/roles.decorator';

import { CreateRecetaDto } from '../dto/create-receta.dto';
import { UpdateRecetaDto } from '../dto/update-receta.dto';
import { RecetasService } from '../service/recetas.service';
import { CalificarRecetaDto } from '../dto/calificar-receta.dto';
import { RecetaEntity } from 'src/models/receta.entity';

@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `receta-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Solo se permiten imágenes válidas'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreateRecetaDto,
    @Req() req,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    // ✅ El método del servicio ahora maneja correctamente imagenUrl
    return this.recetasService.create(dto, usuarioId, rol, imagen);
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
    return this.recetasService.remove(id, req.user.id, req.user.rol);
  }

  @Patch(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async aprobarReceta(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.aprobar(id);
  }

  @Patch(':id/calificar')
  @UseGuards(JwtAuthGuard)
  async calificarReceta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CalificarRecetaDto,
    @Req() req,
  ) {
    return this.recetasService.calificar(id, dto, req.user.id);
  }

  @Get(':id/calificacion-usuario')
  @UseGuards(JwtAuthGuard)
  async obtenerCalificacionUsuario(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.recetasService.obtenerCalificacionUsuario(id, req.user.id);
  }

  @Get(':id/total-calificadores')
  async obtenerTotalCalificadores(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.obtenerTotalCalificadores(id);
  }

  @Get('cercanas')
  findNearby(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.recetasService.findNearby(+lat, +lng);
  }

}
