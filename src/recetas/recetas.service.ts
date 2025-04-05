import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './entity/receta.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';


@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async create(createRecetaDto: CreateRecetaDto): Promise<RecetaEntity> {
    const { usuarioId, ...data } = createRecetaDto;
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    const receta = this.recetaRepository.create({ ...data, usuario });
    return await this.recetaRepository.save(receta);
  }

  async findAll(page = 1, limit = 10): Promise<RecetaEntity[]> {
    const skip = (page - 1) * limit;
    return await this.recetaRepository.find({
      skip,
      take: limit,
      relations: ['usuario'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({ where: { id }, relations: ['usuario'] });
    if (!receta) {
      throw new NotFoundException(`Receta con id ${id} no encontrada`);
    }
    return receta;
  }

  async update(id: number, updateRecetaDto: UpdateRecetaDto): Promise<RecetaEntity> {
    const receta = await this.findOne(id);
    const recetaActualizada = Object.assign(receta, updateRecetaDto);
    return await this.recetaRepository.save(recetaActualizada);
  }

  async remove(id: number): Promise<string> {
    const result = await this.recetaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Receta con id ${id} no encontrada`);
    }
    return `Receta con id ${id} ha sido eliminada exitosamente.`;
  }

  async findByNombre(nombre: string): Promise<RecetaEntity[]> {
    return await this.recetaRepository.find({
      where: { title: ILike(`%${nombre}%`) },
      relations: ['usuario'],
    });
  }
}
