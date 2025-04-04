import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;

  // Configurar CORS correctamente
  app.enableCors({
    origin: '*', // Puedes restringir a dominios específicos si es necesario
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pipes de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora propiedades desconocidas en DTOs
      forbidNonWhitelisted: true, // Rechaza peticiones con propiedades no permitidas
      transform: true, // Convierte los datos al tipo esperado
    })
  );

  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
