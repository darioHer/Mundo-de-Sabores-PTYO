import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioEntity } from './entity/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // validar la contraseña
  private validatePassword(password: string): void {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new UnauthorizedException('La contraseña no cumple con las condiciones mínimas de seguridad.');
    }
  }

  async register(registerDto: RegisterDto): Promise<UsuarioEntity> {
    this.validatePassword(registerDto.password); // Validar la contraseña

    // Verificar si el nombre de usuario ya existe
    const existingUserByUsername: UsuarioEntity | null = await this.usuarioRepository.findOne({ where: { username: registerDto.username } });
    if (existingUserByUsername) {
      throw new UnauthorizedException('El nombre de usuario ya existe.');
    }

    // Verificar si el correo electrónico ya existe
    const existingUserByEmail = await this.usuarioRepository.findOne({ where: { email: registerDto.email } });
    if (existingUserByEmail) {
      throw new UnauthorizedException('El correo electrónico ya está en uso.');
    }

    const hashedPassword = await hash(registerDto.password, 10);
    const usuario = this.usuarioRepository.create({ ...registerDto, password: hashedPassword });
    return await this.usuarioRepository.save(usuario);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { username: loginDto.username } });
    if (!usuario || !(await compare(loginDto.password, usuario.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const payload = { username: usuario.username, sub: usuario.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser (username: string): Promise<UsuarioEntity | null> {
    const usuario = await this.usuarioRepository.findOne({ where: { username } });
    return usuario || null; // Devuelve el usuario si existe, o null si no
  }

  async deleteUser (userId: number): Promise<void> {
    const user = await this.usuarioRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('El usuario no existe.');
    }
    await this.usuarioRepository.remove(user);
  }

  async getAllUsers(): Promise<string[]> {
    const users = await this.usuarioRepository.find();
    return users.map(user => user.username); 
  }
}