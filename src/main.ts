import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que tu frontend (en puerto 5173, por ejemplo) pueda acceder
  app.enableCors({
    origin: 'http://localhost:3001', // 👈 aquí debe ir el puerto del frontend (React/Vite)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3000); // 👈 backend escuchando en puerto 3001
  console.log(`✅ Backend corriendo en http://localhost:3000`);
}

bootstrap();
