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
  UseGuards,
} from '@nestjs/common';
import { AutorOrAdminGuard } from 'src/auth/guard/autor-or-admin.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { ProductosService } from '../service/productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductoDto: CreateProductoDto, @Req() req) {
    const usuarioId = req.user.id;
    return await this.productosService.create(createProductoDto, usuarioId);
  }

  @Get()
  async findAll() {
    return await this.productosService.findAll();
  }

  @Get('mis-productos')
  @UseGuards(JwtAuthGuard)
  async getMisProductos(@Req() req) {
    const usuarioId = req.user.id;
    return await this.productosService.findByUsuario(usuarioId);
  }

  @Get('aprobados')
  @UseGuards(JwtAuthGuard)
  async getProductosAprobados() {
    return await this.productosService.findAprobados();
  }

  @Get('no-aprobados')
  @UseGuards(JwtAuthGuard)
  async getProductosNoAprobados() {
    return await this.productosService.findNoAprobados();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return await this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productosService.remove(id);
  }

  @Patch(':id/aprobar')
  @UseGuards(JwtAuthGuard)
  async aprobarProducto(@Param('id', ParseIntPipe) id: number) {
    return await this.productosService.aprobarProducto(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productosService.findOne(id);
  }
}
