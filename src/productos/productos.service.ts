import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './entity/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<ProductoEntity> {
    const producto = this.productoRepository.create(createProductoDto);
    return await this.productoRepository.save(producto);
  }

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: number): Promise<ProductoEntity> {
    const producto = await this.productoRepository.findOne({ where: { id: id } });
    if (!producto) {
      throw new Error(`Producto with id ${id} not found`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<ProductoEntity> {
    await this.productoRepository.update(id, updateProductoDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }
}