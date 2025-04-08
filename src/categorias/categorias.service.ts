import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaEntity } from './entity/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './entity/update-categoria.dto';

@Injectable()
export class CategoriasService {
    constructor(
        @InjectRepository(CategoriaEntity)
        private readonly categoriaRepository: Repository<CategoriaEntity>,
    ) { }

    async create(dto: CreateCategoriaDto): Promise<CategoriaEntity> {
        const categoria = this.categoriaRepository.create(dto);
        return this.categoriaRepository.save(categoria);
    }

    async findAll(): Promise<CategoriaEntity[]> {
        return this.categoriaRepository.find({ relations: ['recetas', 'productos'] });
    }

    async findOne(id: number): Promise<CategoriaEntity> {
        const categoria = await this.categoriaRepository.findOne({ where: { id }, relations: ['recetas', 'productos'] });
        if (!categoria) throw new NotFoundException('Categoría no encontrada');
        return categoria;
    }

    async update(id: number, dto: UpdateCategoriaDto): Promise<CategoriaEntity> {
        await this.categoriaRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const categoria = await this.findOne(id);
        await this.categoriaRepository.remove(categoria);
    }
}
