import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/module/auth.module';
import { CategoriasModule } from './categorias/module/categorias.module';
import { ComentariosModule } from './comentarios/module/comentarios.module';
import { ProductosModule } from './productos/module/productos.module';
import { RecetasModule } from './recetas/module/recetas.module';
import { RolesModule } from './roles/module/roles.module';
import { UsersModule } from './users/module/users.module';

import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from './config/constans';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(DB_HOST),
        port: +configService.get(DB_PORT),
        username: configService.get(DB_USER),
        password: configService.get(DB_PASSWORD),
        database: configService.get(DB_DATABASE),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
        migrationsRun: true,
      }),
    }),

    AuthModule,
    RecetasModule,
    ComentariosModule,
    ProductosModule,
    CategoriasModule,
    RolesModule,
    UsersModule, 
  ],

  controllers: [AppController], 
  providers: [AppService],     
})
export class AppModule {}
