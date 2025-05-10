import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaEntity } from 'src/models/categoria.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
    constructor(
        @InjectRepository(CategoriaEntity)
        private readonly categoriaRepository: Repository<CategoriaEntity>,

        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
    ) { }

    // ✅ Crear nueva categoría
    async create(dto: CreateCategoriaDto): Promise<CategoriaEntity> {
        const categoria = this.categoriaRepository.create(dto);
        return await this.categoriaRepository.save(categoria);
    }

    // ✅ Obtener todas las categorías con sus recetas asociadas
    async findAll(): Promise<CategoriaEntity[]> {
        return await this.categoriaRepository.find({
            relations: ['recetas'],
            order: { nombre: 'ASC' },
        });
    }

    // ✅ Obtener una categoría por ID con sus relaciones
    async findOne(id: number): Promise<CategoriaEntity> {
        const categoria = await this.categoriaRepository.findOne({
            where: { id },
            relations: ['recetas'],
        });

        if (!categoria) {
            throw new NotFoundException('Categoría no encontrada');
        }

        return categoria;
    }

    // ✅ Obtener solo las recetas de una categoría
    async findRecetasByCategoria(id: number): Promise<RecetaEntity[]> {
        const categoria = await this.findOne(id);
        return categoria.recetas || [];
    }

    // ✅ Actualizar datos de una categoría
    async update(id: number, dto: UpdateCategoriaDto): Promise<CategoriaEntity> {
        const existente = await this.findOne(id);
        const actualizada = Object.assign(existente, dto);
        return await this.categoriaRepository.save(actualizada);
    }

    // ✅ Eliminar una categoría
    async remove(id: number): Promise<void> {
        const categoria = await this.findOne(id);
        await this.categoriaRepository.remove(categoria);
    }
}

