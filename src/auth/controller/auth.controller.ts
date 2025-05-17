import {  Body,  Controller,  Delete,  Get,  HttpCode,  HttpStatus,  Param,  Post,  UseGuards,} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Public } from 'src/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Registro
  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // ✅ Login
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // ✅ Obtener todos los usuarios (solo admin)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  // ✅ Eliminar usuario por ID (solo admin)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    await this.authService.deleteUser(+id);
    return { message: 'Usuario eliminado correctamente.' };
  }
}
