import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoriaEntity } from 'src/models/categoria.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { RegionEntity } from 'src/models/region.entity';

import { CreateRecetaDto } from '../dto/create-receta.dto';
import { UpdateRecetaDto } from '../dto/update-receta.dto';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,

    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,

    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
  ) {}

  async create(createRecetaDto: CreateRecetaDto, usuarioId: number, rol: string): Promise<RecetaEntity> {
    const { categoriaId, regionId, title, ...data } = createRecetaDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    const recetaExistente = await this.recetaRepository.findOne({
      where: { title, usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    if (recetaExistente) {
      throw new ConflictException('Ya tienes una receta con ese título.');
    }

    const recetaData: Partial<RecetaEntity> = {
      title,
      ...data,
      usuario,
      categoria,
      aprobado: rol === 'admin',
    };

    if (regionId) {
      const region = await this.regionRepository.findOne({ where: { id: regionId } });
      if (!region) throw new NotFoundException('Región no encontrada');
      recetaData.region = region;
    }

    const receta = this.recetaRepository.create(recetaData);
    return this.recetaRepository.save(receta);
  }

  async findPendientes(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: false },
      relations: ['usuario', 'categoria', 'region'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: true },
      relations: ['usuario', 'categoria', 'region'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({
      where: { id },
      relations: ['usuario', 'categoria', 'region'],
    });

    if (!receta) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }

    return receta;
  }

  async update(id: number, updateRecetaDto: UpdateRecetaDto): Promise<RecetaEntity> {
    const { categoriaId, regionId, ...resto } = updateRecetaDto;
  
    const receta = await this.recetaRepository.findOne({
      where: { id },
      relations: ['categoria', 'region'],
    });
  
    if (!receta) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }
  
    // Actualizar campos básicos
    Object.assign(receta, resto);
  
    // Si se envía nueva categoría
    if (categoriaId) {
      const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
      if (!categoria) throw new NotFoundException('Categoría no encontrada');
      receta.categoria = categoria;
    }
  
    // Si se envía nueva región
    if (regionId) {
      const region = await this.regionRepository.findOne({ where: { id: regionId } });
      if (!region) throw new NotFoundException('Región no encontrada');
      receta.region = region;
    }
  
    return await this.recetaRepository.save(receta);
  }
  

  async remove(id: number, userId?: number, userRole?: string): Promise<void> {
    const receta = await this.recetaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!receta) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }

    if (userRole !== 'admin' && receta.aprobado) {
      throw new ForbiddenException('No puedes eliminar una receta ya aprobada');
    }

    await this.recetaRepository.remove(receta);
  }

  async findDestacadas(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: true },
      relations: ['usuario', 'categoria', 'region'],
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }

  async aprobar(id: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({ where: { id } });
    if (!receta) throw new NotFoundException('Receta no encontrada');
    receta.aprobado = true;
    return this.recetaRepository.save(receta);
  }

  async findByUsuario(usuarioId: number): Promise<{ aprobadas: RecetaEntity[], pendientes: RecetaEntity[] }> {
    const todas = await this.recetaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['categoria', 'region'],
      order: { createdAt: 'DESC' },
    });

    return {
      aprobadas: todas.filter(r => r.aprobado),
      pendientes: todas.filter(r => !r.aprobado),
    };
  }
}
