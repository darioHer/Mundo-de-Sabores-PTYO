import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './entity/receta.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
  ) {}

  async create(createRecetaDto: CreateRecetaDto): Promise<RecetaEntity> {
    const receta = this.recetaRepository.create(createRecetaDto);
    return await this.recetaRepository.save(receta);
  }

  async findAll(): Promise<RecetaEntity[]> {
    return await this.recetaRepository.find();
  }

  async findOne(id: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({ where: { id } });
    if (!receta) {
      throw new NotFoundException(`Receta con id ${id} no encontrada`);
    }
    return receta;
  }

  async update(id: number, updateRecetaDto: UpdateRecetaDto): Promise<RecetaEntity> {
    await this.recetaRepository.update(id, updateRecetaDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<string> {
    const result = await this.recetaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Receta con id ${id} no encontrada`);
    }
    return `Receta con id ${id} ha sido eliminada exitosamente.`;
  }
}