import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ComentarioEntity } from './entity/comentario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';


@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(ComentarioEntity)
    private readonly comentarioRepository: Repository<ComentarioEntity>,
  ) {}

  async create(createComentarioDto: CreateComentarioDto): Promise<ComentarioEntity> {
    const comentario = this.comentarioRepository.create(createComentarioDto);
    return await this.comentarioRepository.save(comentario);
  }

  async findAll(): Promise<ComentarioEntity[]> {
    return await this.comentarioRepository.find();
  }

  async update(id: number, updateComentarioDto: CreateComentarioDto): Promise<ComentarioEntity> {
    await this.comentarioRepository.update(id, updateComentarioDto);
    const comentario = await this.comentarioRepository.findOne({ where: { id } });
    if (!comentario) {
      throw new Error(`Comentario ${id} no encontrado`);
    }
    return comentario;

}
  async remove(id: number): Promise<void> {
    const result = await this.comentarioRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Comentario ${id} no encontrado`);
    }
    console.log(`Comentario ${id} eliminado`);
  }

}