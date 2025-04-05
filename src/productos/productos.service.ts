import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './entity/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  // Crea un nuevo producto si no existe otro con el mismo nombre
  async create(createProductoDto: CreateProductoDto): Promise<ProductoEntity> {
    const { usuarioId, ...data } = createProductoDto;
  
    const existe = await this.productoRepository.findOne({ where: { name: data.name } });
    if (existe) {
      throw new BadRequestException('El producto ya existe.');
    }
  
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    const producto = this.productoRepository.create({
      ...data,
      usuario: usuario, // Asociar el usuario
    });
  
    return await this.productoRepository.save(producto);
  }
  

  // Devuelve una lista de productos con paginación (por defecto página 1, 10 productos)
  async findAll(page: number = 1, limit: number = 10): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      skip: (page - 1) * limit, // cuántos omitir
      take: limit,              // cuántos traer
    });
  }

  // Busca un producto por su ID y lanza error si no existe
  async findOne(id: number): Promise<ProductoEntity> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  // Actualiza un producto existente y retorna su nueva versión
  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<ProductoEntity> {
    const result = await this.productoRepository.update(id, updateProductoDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return await this.findOne(id); // Retorna el producto actualizado
  }

  // Elimina un producto si existe
  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id); // Verifica existencia
    await this.productoRepository.remove(producto);
  }
}
