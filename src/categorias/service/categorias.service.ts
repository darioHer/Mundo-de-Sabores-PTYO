import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
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

    async create(dto: CreateCategoriaDto): Promise<CategoriaEntity> {
        const existe = await this.categoriaRepository.findOne({
            where: { nombre: dto.nombre },
        });

        if (existe) {
            throw new ConflictException('Ya existe una categoría con ese nombre.');
        }

        const categoria = this.categoriaRepository.create(dto);
        return await this.categoriaRepository.save(categoria);
    }

    // 🔄 Nueva implementación que incluye recetaCount
    async findAll(): Promise<any[]> {
        return await this.categoriaRepository
            .createQueryBuilder('categoria')
            .leftJoin('categoria.recetas', 'receta')
            .loadRelationCountAndMap('categoria.recetaCount', 'categoria.recetas')
            .orderBy('categoria.nombre', 'ASC')
            .getMany();
    }

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

    async findRecetasByCategoria(id: number): Promise<RecetaEntity[]> {
        const categoria = await this.findOne(id);
        return categoria.recetas || [];
    }

    async update(id: number, dto: UpdateCategoriaDto): Promise<CategoriaEntity> {
        const existente = await this.findOne(id);

        if (dto.nombre && dto.nombre !== existente.nombre) {
            const duplicada = await this.categoriaRepository.findOne({
                where: { nombre: dto.nombre },
            });

            if (duplicada) {
                throw new ConflictException('Otra categoría ya tiene ese nombre.');
            }
        }

        const actualizada = Object.assign(existente, dto);
        return await this.categoriaRepository.save(actualizada);
    }

    async remove(id: number): Promise<void> {
        const categoria = await this.findOne(id);
        await this.categoriaRepository.remove(categoria);
    }
}
