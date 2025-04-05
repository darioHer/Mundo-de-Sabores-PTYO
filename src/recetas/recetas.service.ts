import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './entity/receta.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { UsuarioRecetaFavoritaEntity } from './favoritos/usuario_receta_favorita.entity';
import { CalificacionEntity } from './entity/calificacion.entity';
import { CalificarRecetaDto } from './dto/calificar-receta.dto';


@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(UsuarioRecetaFavoritaEntity)
    private readonly favoritoRepository: Repository<UsuarioRecetaFavoritaEntity>,
    @InjectRepository(CalificacionEntity)
    private readonly calificacionRepository: Repository<CalificacionEntity>,
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

  async marcarFavorito(recetaId: number, usuarioId: number): Promise<string> {
    const receta = await this.recetaRepository.findOne({ where: { id: recetaId } });
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
  
    if (!receta || !usuario) throw new NotFoundException('Receta o Usuario no encontrado');
  
    const yaExiste = await this.favoritoRepository.findOne({ where: { receta, usuario } });
    if (yaExiste) throw new BadRequestException('Ya marcaste esta receta como favorita');
  
    const favorito = this.favoritoRepository.create({ receta, usuario });
    await this.favoritoRepository.save(favorito);
    return 'Receta marcada como favorita';
  }
  
  async obtenerFavoritosPorUsuario(usuarioId: number): Promise<RecetaEntity[]> {
    const favoritos = await this.favoritoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['receta'],
    });
    return favoritos.map(fav => fav.receta);
  }
  async calificarReceta(
    recetaId: number,
    usuarioId: number,
    dto: CalificarRecetaDto,
  ): Promise<string> {
    const receta = await this.recetaRepository.findOne({ where: { id: recetaId } });
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
  
    if (!receta || !usuario) throw new NotFoundException('Receta o Usuario no encontrado');
  
    const calificacionExistente = await this.calificacionRepository.findOne({ where: { receta, usuario } });
  
    if (calificacionExistente) {
      calificacionExistente.puntuacion = dto.puntuacion;
      await this.calificacionRepository.save(calificacionExistente);
      return 'Calificación actualizada';
    }
  
    const nueva = this.calificacionRepository.create({ receta, usuario, puntuacion: dto.puntuacion });
    await this.calificacionRepository.save(nueva);
    return 'Receta calificada';
  }

  
}
