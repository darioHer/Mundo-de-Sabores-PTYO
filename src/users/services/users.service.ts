import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly userRepository: Repository<UsuarioEntity>,
    ) { }

    async getAllUsers(): Promise<UsuarioEntity[]> {
        return await this.userRepository.find({
            relations: ['rol'],
            order: { username: 'ASC' },
        });
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('El usuario no existe.');
        await this.userRepository.remove(user);
    }

    async obtenerPerfilPublico(id: number): Promise<any> {
        const usuario = await this.userRepository.findOne({
            where: { id },
            relations: ['rol', 'recetas', 'comentarios'],
        });
    
        if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    
        return {
            id: usuario.id,
            username: usuario.username,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            avatarUrl: usuario.avatarUrl, // ← nombre corregido
            fechaNacimiento: usuario.fechaNacimiento,
            biografia: usuario.biografia,
            rol: usuario.rol?.name,
            recetas: usuario.recetas,
            comentarios: usuario.comentarios,
        };
    }
    
    async updateUser(id: number, dto: UpdateUserDto): Promise<UsuarioEntity> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado.');

        Object.assign(user, dto);
        return this.userRepository.save(user);
    }

    async updateAvatar(id: number, path: string): Promise<UsuarioEntity> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        user.avatarUrl = path;
        return this.userRepository.save(user);
    }
}
