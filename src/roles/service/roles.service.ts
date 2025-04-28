import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from 'src/models/rol.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';


@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RolEntity)
        private readonly roleRepository: Repository<RolEntity>,
    ) { }


    async findAll(): Promise<RolEntity[]> {
        return this.roleRepository.find();
    }


    async findOne(id: number): Promise<RolEntity> {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
        return role;
    }


    async create(createRoleDto: CreateRoleDto): Promise<RolEntity> {
        const role = this.roleRepository.create(createRoleDto);
        return this.roleRepository.save(role);
    }


    async delete(id: number): Promise<void> {
        const result = await this.roleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Rol con ID ${id} no encontrado`);
        }
    }

    async seedRoles(): Promise<void> {
        const defaultRoles = ['usuario', 'admin'];

        for (const name of defaultRoles) {
            const exists = await this.roleRepository.findOne({ where: { name } });
            if (!exists) {
                const rol = this.roleRepository.create({ name });
                await this.roleRepository.save(rol);
                console.log(`Rol '${name}' creado.`);
            }
        }
    }
}
