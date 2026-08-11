// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://192.168.1.10:3000',
      'http://localhost:3000',
    ],

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    credentials: true,
  });

  await app.listen(5000, '0.0.0.0');

  console.log('🚀 Backend corriendo en http://0.0.0.0:5000');
}

bootstrap();