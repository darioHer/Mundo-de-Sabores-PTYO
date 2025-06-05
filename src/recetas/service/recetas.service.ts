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
import { CalificacionEntity } from 'src/models/calificacion.entity';

import { CreateRecetaDto } from '../dto/create-receta.dto';
import { UpdateRecetaDto } from '../dto/update-receta.dto';
import { CalificarRecetaDto } from '../dto/calificar-receta.dto';

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

    @InjectRepository(CalificacionEntity)
    private readonly calificacionRepository: Repository<CalificacionEntity>,
  ) {}

  async create(
    createRecetaDto: CreateRecetaDto,
    usuarioId: number,
    rol: string,
    imagen?: Express.Multer.File,
  ): Promise<RecetaEntity> {
    const { categoriaId, regionId, title, ...data } = createRecetaDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const categoria = await this.categoriaRepository.findOne({ where: { id: Number(categoriaId) } });
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
      const region = await this.regionRepository.findOne({ where: { id: Number(regionId) } });
      if (!region) throw new NotFoundException('Región no encontrada');
      recetaData.region = region;
    }

    if (imagen) {
      recetaData.imagenUrl = `/uploads/${imagen.filename}`;
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
    if (!receta) throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    return receta;
  }

  async update(id: number, updateDto: UpdateRecetaDto): Promise<RecetaEntity> {
    const { categoriaId, regionId, ...resto } = updateDto;
    const receta = await this.recetaRepository.findOne({ where: { id } });
    if (!receta) throw new NotFoundException('Receta no encontrada');

    Object.assign(receta, resto);

    if (categoriaId) {
      const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
      if (!categoria) throw new NotFoundException('Categoría no encontrada');
      receta.categoria = categoria;
    }

    if (regionId) {
      const region = await this.regionRepository.findOne({ where: { id: regionId } });
      if (!region) throw new NotFoundException('Región no encontrada');
      receta.region = region;
    }

    return this.recetaRepository.save(receta);
  }

  async remove(id: number, userId?: number, userRole?: string): Promise<void> {
    const receta = await this.recetaRepository.findOne({ where: { id }, relations: ['usuario'] });
    if (!receta) throw new NotFoundException(`Receta con ID ${id} no encontrada`);

    if (userRole !== 'admin' && receta.aprobado) {
      throw new ForbiddenException('No puedes eliminar una receta ya aprobada');
    }

    await this.recetaRepository.remove(receta);
  }

  async aprobar(id: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({ where: { id } });
    if (!receta) throw new NotFoundException('Receta no encontrada');
    receta.aprobado = true;
    return this.recetaRepository.save(receta);
  }

  async findByUsuario(usuarioId: number): Promise<{ aprobadas: RecetaEntity[]; pendientes: RecetaEntity[] }> {
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

  async calificar(id: number, dto: CalificarRecetaDto, userId: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({ where: { id } });
    if (!receta) throw new NotFoundException('Receta no encontrada');

    const usuario = await this.usuarioRepository.findOne({ where: { id: userId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const yaCalifico = await this.calificacionRepository.findOne({
      where: { receta: { id }, usuario: { id: userId } },
    });

    if (yaCalifico) throw new ConflictException('Ya has calificado esta receta');

    const nuevaCalificacion = this.calificacionRepository.create({
      calificacion: dto.calificacion,
      receta,
      usuario,
    });

    await this.calificacionRepository.save(nuevaCalificacion);

    // Recalcular promedio por usuarios únicos
    const calificaciones = await this.calificacionRepository.find({
      where: { receta: { id } },
    });

    const suma = calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0);
    const usuariosUnicos = new Set(calificaciones.map(c => c.usuario.id)).size;

    receta.totalCalificaciones = suma;
    receta.cantidadCalificaciones = usuariosUnicos;
    receta.promedioCalificacion = parseFloat((suma / usuariosUnicos).toFixed(2));

    return this.recetaRepository.save(receta);
  }

  async obtenerCalificacionUsuario(recetaId: number, usuarioId: number): Promise<number | null> {
    const calificacion = await this.calificacionRepository.findOne({
      where: {
        receta: { id: recetaId },
        usuario: { id: usuarioId },
      },
    });

    return calificacion ? calificacion.calificacion : null;
  }

  async findDestacadas(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: true },
      order: { promedioCalificacion: 'DESC' },
      take: 5,
      relations: ['usuario', 'categoria', 'region'],
    });
  }
  

  async obtenerTotalCalificadores(id: number): Promise<{ total: number }> {
    const total = await this.calificacionRepository
      .createQueryBuilder('calificacion')
      .select('COUNT(DISTINCT calificacion.usuario)', 'total')
      .where('calificacion.receta = :id', { id })
      .getRawOne();
  
    return { total: parseInt(total.total, 10) || 0 };
  }
  
  async recalcularCalificaciones(recetaId: number): Promise<void> {
    const receta = await this.recetaRepository.findOne({ where: { id: recetaId } });
    if (!receta) throw new NotFoundException('Receta no encontrada');
  
    const calificaciones = await this.calificacionRepository.find({
      where: { receta: { id: recetaId } },
      relations: ['usuario'],
    });
  
    const suma = calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0);
    const usuariosUnicos = new Set(calificaciones.map(c => c.usuario.id)).size;
  
    receta.totalCalificaciones = suma;
    receta.cantidadCalificaciones = usuariosUnicos;
    receta.promedioCalificacion = usuariosUnicos === 0 ? 0 : parseFloat((suma / usuariosUnicos).toFixed(2));
  
    await this.recetaRepository.save(receta);
  }
  async eliminarCalificacionUsuario(recetaId: number, usuarioId: number): Promise<void> {
    const calificacion = await this.calificacionRepository.findOne({
      where: {
        receta: { id: recetaId },
        usuario: { id: usuarioId },
      },
      relations: ['receta', 'usuario'],
    });
  
    if (!calificacion) return;
  
    await this.calificacionRepository.remove(calificacion);
  
    const calificaciones = await this.calificacionRepository.find({
      where: { receta: { id: recetaId } },
    });
  
    const suma = calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0);
    const usuariosUnicos = new Set(calificaciones.map(c => c.usuario.id)).size;
  
    const receta = await this.recetaRepository.findOne({ where: { id: recetaId } });
    if (!receta) return;
  
    receta.totalCalificaciones = suma;
    receta.cantidadCalificaciones = usuariosUnicos;
    receta.promedioCalificacion = usuariosUnicos > 0 ? parseFloat((suma / usuariosUnicos).toFixed(2)) : 0;
  
    await this.recetaRepository.save(receta);
  }
  
  async findNearby(lat: number, lng: number): Promise<RecetaEntity[]> {
    const distanciaMaximaKm = 10; // Radio configurable
  
    return this.recetaRepository
      .createQueryBuilder('receta')
      .where(`
        6371 * acos(
          cos(radians(:lat)) *
          cos(radians(receta.latitud)) *
          cos(radians(receta.longitud) - radians(:lng)) +
          sin(radians(:lat)) *
          sin(radians(receta.latitud))
        ) < :distancia
      `, { lat, lng, distancia: distanciaMaximaKm })
      .getMany();
  }
  
    
}
