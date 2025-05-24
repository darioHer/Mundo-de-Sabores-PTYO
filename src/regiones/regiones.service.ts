import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegionEntity } from 'src/models/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RecetaEntity } from 'src/models/receta.entity';

@Injectable()
export class RegionService {
    constructor(
        @InjectRepository(RegionEntity)
        private readonly regionRepo: Repository<RegionEntity>,
    ) { }

    async create(dto: CreateRegionDto) {
        const existe = await this.regionRepo.findOne({ where: { nombre: dto.nombre } });
        if (existe) throw new ConflictException('La región ya existe');

        const region = this.regionRepo.create(dto);
        return await this.regionRepo.save(region);
    }

    async findAll() {
        return await this.regionRepo.find({ relations: ['recetas'] });
    }

    async findOne(id: number): Promise<RegionEntity> {
        const region = await this.regionRepo.findOne({
            where: { id },
            relations: ['recetas'],
        });
        if (!region) {
            throw new NotFoundException(`Región con ID ${id} no encontrada`);
        }
        return region;
    }

    async findRecetasByRegion(id: number): Promise<RecetaEntity[]> {
        const region = await this.regionRepo.findOne({
            where: { id },
            relations: ['recetas', 'recetas.usuario', 'recetas.categoria'],
        });
        if (!region) {
            throw new NotFoundException(`Región con ID ${id} no encontrada`);
        }
        return region.recetas.filter(receta => receta.aprobado);
    }

    async update(id: number, dto: UpdateRegionDto): Promise<RegionEntity> {
        const region = await this.regionRepo.preload({ id, ...dto });
        if (!region) {
            throw new NotFoundException(`Región con ID ${id} no encontrada`);
        }
        return await this.regionRepo.save(region);
    }

    async remove(id: number): Promise<void> {
        const region = await this.regionRepo.findOne({ where: { id } });
        if (!region) {
            throw new NotFoundException(`Región con ID ${id} no encontrada`);
        }
        await this.regionRepo.remove(region);
    }
}
