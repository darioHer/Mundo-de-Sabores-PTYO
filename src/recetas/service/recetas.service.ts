import {    Injectable,    NotFoundException} from '@nestjs/common';
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

  async create(createRecetaDto: CreateRecetaDto, usuarioId: number): Promise<RecetaEntity> {
    const { categoriaId, ...data } = createRecetaDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    const receta = this.recetaRepository.create({
      ...data,
      usuario,
      categoria,
      aprobado: false,
    });

    return await this.recetaRepository.save(receta);
  }

  async findAll(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: true },
      relations: ['usuario', 'categoria'],
      order: { createdAt: 'DESC' }, 
    });
  }

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

  async update(id: number, updateRecetaDto: UpdateRecetaDto): Promise<RecetaEntity> {
    const receta = await this.recetaRepository.preload({ id, ...updateRecetaDto });
    if (!receta) throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    return this.recetaRepository.save(receta);
  }

  async remove(id: number): Promise<void> {
    const receta = await this.recetaRepository.findOne({ where: { id } });
    if (!receta) throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    await this.recetaRepository.remove(receta);
  }

  async findDestacadas(): Promise<RecetaEntity[]> {
    return this.recetaRepository.find({
      where: { aprobado: true },
      relations: ['usuario', 'categoria'],
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
}
