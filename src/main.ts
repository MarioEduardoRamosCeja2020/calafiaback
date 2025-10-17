import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para cualquier origen (o puedes restringirlo a http://localhost:5173)
  app.enableCors({
    origin: 'http://localhost:3001', // <-- aquí pones el puerto de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend corriendo en http://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();