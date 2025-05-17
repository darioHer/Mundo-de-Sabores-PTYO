import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaEntity } from 'src/models/categoria.entity';
import { RecetaEntity } from 'src/models/receta.entity';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { Repository } from 'typeorm';
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
  ) {}

  // Crear receta (evita duplicados por usuario + título)
  async create(createRecetaDto: CreateRecetaDto, usuarioId: number, rol: string): Promise<RecetaEntity> {
    const { categoriaId, title, ...data } = createRecetaDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    // 🚫 Validar si el usuario ya tiene una receta con el mismo título
    const recetaExistente = await this.recetaRepository.findOne({
      where: {
        title,
        usuario: { id: usuarioId },
      },
      relations: ['usuario'],
    });

    if (recetaExistente) {
      throw new ConflictException('Ya tienes una receta con ese título.');
    }

    const receta = this.recetaRepository.create({
      title,
      ...data,
      usuario,
      categoria,
      aprobado: rol === 'admin',
    });

    return await this.recetaRepository.save(receta);
  }

  //  Recetas pendientes (solo admin)
  async findPendientes(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: false },
      relations: ['usuario', 'categoria'],
      order: { createdAt: 'DESC' },
    });
  }

  //  Recetas aprobadas (públicas)
  async findAll(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: true },
      relations: ['usuario', 'categoria'],
      order: { createdAt: 'DESC' },
    });
  }

  //  Obtener receta por ID
  async findOne(id: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({
      where: { id },
      relations: ['usuario', 'categoria'],
    });

    if (!receta) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }

    return receta;
  }

  //  Actualizar receta
  async update(id: number, updateRecetaDto: UpdateRecetaDto): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.preload({ id, ...updateRecetaDto });
    if (!receta) throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    return this.recetaRepository.save(receta);
  }

  //  Eliminar receta (user: solo si no ha sido aprobada, admin: siempre puede)
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

  //  Recetas destacadas
  async findDestacadas(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: true },
      relations: ['usuario', 'categoria'],
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }

  //  Aprobar receta
  async aprobar(id: number): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.findOne({ where: { id } });
    if (!receta) throw new NotFoundException('Receta no encontrada');
    receta.aprobado = true;
    return this.recetaRepository.save(receta);
  }

  // Buscar recetas por usuario (retorna separadas)
  async findByUsuario(usuarioId: number): Promise<{ aprobadas: RecetaEntity[], pendientes: RecetaEntity[] }> {
    const todas = await this.recetaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['categoria'],
      order: { createdAt: 'DESC' },
    });

    return {
      aprobadas: todas.filter(r => r.aprobado),
      pendientes: todas.filter(r => !r.aprobado),
    };
  }
}
