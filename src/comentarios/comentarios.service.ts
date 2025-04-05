import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComentarioEntity } from './entity/comentario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { UsuarioEntity } from 'src/auth/entity/usuario.entity';


@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(ComentarioEntity)
    private readonly comentarioRepository: Repository<ComentarioEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async create(createComentarioDto: CreateComentarioDto): Promise<ComentarioEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: createComentarioDto.usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createComentarioDto.usuarioId} no encontrado`);
    }

    const comentario = this.comentarioRepository.create({
      contenido: createComentarioDto.contenido,
      usuario: usuario,
    });

    return await this.comentarioRepository.save(comentario);
  }

  async findAll(): Promise<ComentarioEntity[]> {
    return await this.comentarioRepository.find({
      relations: ['usuario'],
    });
  }

  async update(id: number, updateComentarioDto: UpdateComentarioDto): Promise<ComentarioEntity> {
    const comentario = await this.comentarioRepository.findOne({ where: { id } });
    if (!comentario) {
      throw new NotFoundException(`Comentario ${id} no encontrado`);
    }

    if (updateComentarioDto.usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: updateComentarioDto.usuarioId } });
      if (!usuario) throw new NotFoundException(`Usuario con ID ${updateComentarioDto.usuarioId} no encontrado`);
      comentario.usuario = usuario;
    }

    if (updateComentarioDto.contenido) {
      comentario.contenido = updateComentarioDto.contenido;
    }

    return await this.comentarioRepository.save(comentario);
  }

  async remove(id: number): Promise<void> {
    const result = await this.comentarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comentario ${id} no encontrado`);
    }
  }
}
