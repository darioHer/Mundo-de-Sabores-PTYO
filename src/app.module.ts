import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constans';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecetasModule } from './recetas/recetas.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';

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
      synchronize: false,
      logging: false,
      migrationsRun: false,
    }),
    inject: [ConfigService],
  }),
  
  AuthModule,
  
  RecetasModule,
  
  ComentariosModule,
  
  ProductosModule,
  
  CategoriasModule,
  


  


  ],
  controllers: [AppController,  ],
  providers: [AppService, ConfigService, ],
})
export class AppModule {}
