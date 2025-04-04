import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Delete('user/:id') 
  async deleteUser (@Param('id') id: string) {
    await this.authService.deleteUser (+id); 
    return { message: 'Usuario eliminado correctamente.' };
  }

  @Get('users') 
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }
}