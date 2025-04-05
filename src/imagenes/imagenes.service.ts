
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenEntity } from './entity/imagen.entity';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { RecetaEntity } from 'src/recetas/entity/receta.entity';
import { ProductoEntity } from 'src/productos/entity/producto.entity';

@Injectable()
export class ImagenesService {
    constructor(
    @InjectRepository(ImagenEntity)
    private readonly imagenRepository: Repository<ImagenEntity>,
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    ) {}

async create(dto: CreateImagenDto): Promise<ImagenEntity> {
    const imagen = new ImagenEntity();
    imagen.url = dto.url;

    if (dto.recetaId) {
        const receta = await this.recetaRepository.findOneBy({ id: dto.recetaId });
        if (receta) {
            imagen.receta = receta;
        }
    }

    if (dto.productoId) {
        const producto = await this.productoRepository.findOneBy({ id: dto.productoId });
        if (producto) {
            imagen.producto = producto;
        }
    }

    return this.imagenRepository.save(imagen);
    }

    async findAll(): Promise<ImagenEntity[]> {
    return this.imagenRepository.find({
        relations: ['receta', 'producto'],
    });
    }
}
