import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';

import { UsuarioEntity } from '../../models/usuario.entity';
import { RolEntity } from '../../models/rol.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,

    @InjectRepository(RolEntity)
    private readonly rolRepository: Repository<RolEntity>,

    private readonly jwtService: JwtService,
  ) {}

  // Validación de contraseña segura
  private validatePassword(password: string): void {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new UnauthorizedException(
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
      );
    }
  }

  // Registro de usuario
  async register(registerDto: RegisterDto): Promise<UsuarioEntity> {
    this.validatePassword(registerDto.password);

    const { username, email, password, rolId } = registerDto;

    const existingUsername = await this.usuarioRepository.findOne({ where: { username } });
    if (existingUsername) throw new UnauthorizedException('El nombre de usuario ya existe.');

    const existingEmail = await this.usuarioRepository.findOne({ where: { email } });
    if (existingEmail) throw new UnauthorizedException('El correo electrónico ya está en uso.');

    const hashedPassword = await hash(password, 10);

    const rol = rolId
      ? await this.rolRepository.findOne({ where: { id: rolId } })
      : await this.rolRepository.findOne({ where: { name: 'usuario' } });

    if (!rol) throw new NotFoundException('Rol no encontrado.');

    const usuario = this.usuarioRepository.create({
      username,
      email,
      password: hashedPassword,
      rol,
    });

    return await this.usuarioRepository.save(usuario);
  }

  // Login y generación de JWT
  async login(loginDto: LoginDto): Promise<{ access_token: string; userId: number }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { username: loginDto.username },
      relations: ['rol'],
    });
  
    if (!usuario || !(await compare(loginDto.password, usuario.password))) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }
  
    if (!usuario.rol || !usuario.rol.name) {
      throw new UnauthorizedException('Rol no reconocido o no asignado al usuario.');
    }
  
    const payload = {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol.name,
    };
  
    return {
      access_token: this.jwtService.sign(payload),
      userId: usuario.id,
    };
  }
  

  // Validación manual (no expone datos)
  async validateUser(username: string): Promise<UsuarioEntity | null> {
    return await this.usuarioRepository.findOne({ where: { username } });
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<UsuarioEntity[]> {
    return await this.usuarioRepository.find({
      relations: ['rol'],
      order: { username: 'ASC' },
    });
  }

  // Eliminar usuario por ID
  async deleteUser(userId: number): Promise<void> {
    const user = await this.usuarioRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('El usuario no existe.');
    await this.usuarioRepository.remove(user);
  }

  // Perfil público extendido
  async obtenerPerfilPublico(id: number): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol', 'recetas', 'comentarios', 'calificaciones'],
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado.');

    return {
      nombre: usuario.username,
      email: usuario.email,
      rol: usuario.rol?.name,
      recetas: usuario.recetas,
      comentarios: usuario.comentarios,
    };
  }
}
