import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolesService } from '../service/roles.service';
import { RolEntity } from 'src/models/rol.entity';
import { CreateRoleDto } from '../dto/create-role.dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    async getAllRoles(): Promise<RolEntity[]> {
        return this.rolesService.findAll();
    }

    @Get(':id')
    async getRoleById(@Param('id') id: string): Promise<RolEntity> {
        return this.rolesService.findOne(+id);
    }

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RolEntity> {
        return this.rolesService.create(createRoleDto);
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string): Promise<void> {
        return this.rolesService.delete(+id);
    }
}
