import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComentarioEntity } from 'src/models/comentario.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { CreateComentarioDto } from '../dto/create-comentario.dto';
import { RecetasService } from 'src/recetas/service/recetas.service';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(ComentarioEntity)
    private readonly comentarioRepo: Repository<ComentarioEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepo: Repository<UsuarioEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepo: Repository<RecetaEntity>,

    private readonly recetasService: RecetasService,
  ) {}

  async create(dto: CreateComentarioDto, userId: number): Promise<ComentarioEntity> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: userId } });
    const receta = await this.recetaRepo.findOne({ where: { id: dto.recetaId } });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (!receta) throw new NotFoundException('Receta no encontrada');

    const comentario = this.comentarioRepo.create({
      contenido: dto.contenido,
      usuario,
      receta,
    });

    return this.comentarioRepo.save(comentario);
  }

  async findByReceta(recetaId: number): Promise<ComentarioEntity[]> {
    return this.comentarioRepo.find({
      where: { receta: { id: recetaId } },
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<ComentarioEntity[]> {
    return this.comentarioRepo.find({
      relations: ['usuario', 'receta'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: number, userId: number, rol: string): Promise<void> {
    const comentario = await this.comentarioRepo.findOne({
      where: { id },
      relations: ['usuario', 'receta'],
    });

    if (!comentario) throw new NotFoundException('Comentario no encontrado');

    const esAutor = comentario.usuario.id === userId;
    const esAdmin = rol === 'admin';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException('No tienes permisos para eliminar este comentario');
    }

    await this.comentarioRepo.remove(comentario);

    await this.recetasService.eliminarCalificacionUsuario(
      comentario.receta.id,
      comentario.usuario.id,
    );
  }
}
