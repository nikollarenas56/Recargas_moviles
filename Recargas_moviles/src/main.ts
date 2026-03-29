import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS habilitado para facilitar integración con cliente web/móvil.
  app.enableCors();
  // Prefijo global para versionar/organizar endpoints REST.
  app.setGlobalPrefix('api');
  
  // Validación global defensiva:
  // - whitelist: elimina propiedades no declaradas.
  // - forbidNonWhitelisted: rechaza payloads con campos extra.
  // - transform: convierte tipos según DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Estandariza formato de errores para clientes y observabilidad.
  app.useGlobalFilters(new HttpExceptionFilter());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
