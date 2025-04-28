import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/module/auth.module';
import { CategoriasModule } from './categorias/module/categorias.module';
import { ComentariosModule } from './comentarios/module/comentarios.module';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constans';
import { ProductosModule } from './productos/module/productos.module';
import { RecetasModule } from './recetas/module/recetas.module';
import { RolesModule } from './roles/module/roles.module';

@Module({
  imports: [
    
  ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
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
    inject: [ConfigService],
  }),
  
  AuthModule,
  
  RecetasModule,
  
  ComentariosModule,
  
  ProductosModule,
  
  CategoriasModule,
  
  RolesModule,
  


  


  ],
  controllers: [AppController,  ],
  providers: [AppService, ConfigService, ],
})
export class AppModule {}
