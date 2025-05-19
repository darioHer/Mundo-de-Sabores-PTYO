import {
    Controller,
    Get,
    Param,
    Delete,
    Put,
    Body,
    UseGuards,
    Req,
    Post,
    UploadedFile,
    UseInterceptors,
    ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('usuarios')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(+id);
    }

    @Get('perfil/:id')
    getPerfilPublico(@Param('id') id: string) {
        return this.usersService.obtenerPerfilPublico(+id);
    }

    @Put('perfil/:id')
    @UseGuards(JwtAuthGuard)
    updatePerfil(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
        @Req() req: any,
    ) {
        const userId = req.user.id || req.user.sub;
        if (userId !== +id) {
            throw new ForbiddenException('No autorizado para modificar este perfil');
        }
        return this.usersService.updateUser(+id, dto);
    }

    @Post('avatar/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (req, file, callback) => {
                    const ext = extname(file.originalname);
                    const filename = `avatar-${Date.now()}${ext}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async uploadAvatar(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        const userId = req.user.id || req.user.sub;
        if (userId !== +id) {
            throw new ForbiddenException('No autorizado para subir imagen');
        }

        const filePath = `/uploads/avatars/${file.filename}`; // Importante esta ruta pública
        return this.usersService.updateAvatar(+id, filePath); // Guarda la ruta en DB
    }
}