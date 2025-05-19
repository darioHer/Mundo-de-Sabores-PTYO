import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { UsuarioEntity } from 'src/models/usuario.entity';
import { RolEntity } from 'src/models/rol.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioEntity, RolEntity])

    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
