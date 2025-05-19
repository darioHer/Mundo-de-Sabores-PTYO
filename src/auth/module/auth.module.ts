import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from 'src/models/rol.entity';
import { RolesModule } from 'src/roles/module/roles.module';
import { UsuarioEntity } from '../../models/usuario.entity';
import { AuthService } from '../service/auth.service';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthController } from '../controller/auth.controller';
import { UsersModule } from 'src/users/module/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
    TypeOrmModule.forFeature([UsuarioEntity, RolEntity]),
    RolesModule,
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
