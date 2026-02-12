// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Use the built-in enableCors method
  const app = await NestFactory.create(AppModule);

  // Enable global validation of incoming requests using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Use the built-in enableCors method
  app.enableCors({
    // Replace with your actual frontend URL (e.g., http://localhost:3000)
    origin: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(5000); // Ensure this port matches your frontend env variable
}
bootstrap();
