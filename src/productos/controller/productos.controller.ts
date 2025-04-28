import {  Controller,  Get,  Post,  Body,  Param,  Put,  Delete,  UseGuards,  Req,  ParseIntPipe,} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AutorOrAdminGuard } from 'src/auth/guard/autor-or-admin.guard';
import { ProductosService } from '../service/productos.service';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productosService.findOne(id);
  }

  @Get('mis-productos')
  @UseGuards(JwtAuthGuard)
  async getMisProductos(@Req() req) {
    const usuarioId = req.user.id;
    return await this.productosService.findByUsuario(usuarioId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
    return await this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AutorOrAdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productosService.remove(id);
  }
}