import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './entity/receta.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';
import { CategoriaEntity } from 'src/categorias/entity/categoria.entity';
import { UpdateRecetaDto } from './dto/update-receta.dto';


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

  async create(createRecetaDto: CreateRecetaDto): Promise<RecetaEntity> {
    const { usuarioId, categoriaId, ...data } = createRecetaDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    const receta = this.recetaRepository.create({
      ...data,
      usuario,
      categoria,
    });

    return await this.recetaRepository.save(receta);
  }

  async findAll(): Promise<RecetaEntity[]> {
    return await this.recetaRepository.find({
      relations: ['usuario', 'categoria'],
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
    const receta = await this.recetaRepository.preload({
      id,
      ...updateRecetaDto,
    });

    if (!receta) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }

    return this.recetaRepository.save(receta);
  }

  async remove(id: number): Promise<void> {
    const receta = await this.recetaRepository.findOne({ where: { id } });

    if (!receta) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }

    await this.recetaRepository.remove(receta);
  }
}