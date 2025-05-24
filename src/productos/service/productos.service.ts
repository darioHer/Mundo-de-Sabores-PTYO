import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/models/producto.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { Repository } from 'typeorm';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async create(
    createProductoDto: CreateProductoDto,
    usuarioId: number,
  ): Promise<ProductoEntity> {
    const { name, ...rest } = createProductoDto;

    const existe = await this.productoRepository.findOne({ where: { name } });
    if (existe) {
      throw new BadRequestException('El producto ya existe.');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const producto = this.productoRepository.create({
      name,
      ...rest,
      usuario,
      aprobado: false,
    });

    return await this.productoRepository.save(producto);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<ProductoEntity> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return producto;
  }

  async findByUsuario(usuarioId: number): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<ProductoEntity> {
    const productoExistente = await this.productoRepository.findOne({
      where: { id },
    });

    if (!productoExistente) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    if (
      updateProductoDto.name &&
      updateProductoDto.name !== productoExistente.name
    ) {
      const duplicado = await this.productoRepository.findOne({
        where: { name: updateProductoDto.name },
      });

      if (duplicado) {
        throw new BadRequestException('Ya existe otro producto con ese nombre.');
      }
    }

    const actualizado = Object.assign(productoExistente, updateProductoDto);
    return await this.productoRepository.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }

  async aprobarProducto(id: number): Promise<ProductoEntity> {
    const producto = await this.findOne(id);

    if (producto.aprobado) {
      throw new BadRequestException('Este producto ya fue aprobado.');
    }

    producto.aprobado = true;
    return await this.productoRepository.save(producto);
  }

  // ✅ NUEVOS MÉTODOS

  async findAprobados(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      where: { aprobado: true },
      relations: ['usuario', 'categoria'], // asegúrate que 'categoria' esté definido
    });
  }

  async findNoAprobados(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      where: { aprobado: false },
      relations: ['usuario', 'categoria'],
    });
  }
}
