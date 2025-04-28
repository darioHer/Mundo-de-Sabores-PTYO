import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { RolEntity } from './models/rol.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;

  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // ✅ Crear el rol "usuario" si no existe
  const dataSource = app.get(DataSource);
  const rolRepo = dataSource.getRepository(RolEntity);
  const userRol = await rolRepo.findOne({ where: { name: 'usuario' } });
  if (!userRol) {
    await rolRepo.save(rolRepo.create({ name: 'usuario' }));
    console.log('✅ Rol "usuario" creado automáticamente');
  }

  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
