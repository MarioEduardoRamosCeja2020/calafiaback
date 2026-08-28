import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express = require('express');

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://192.168.1.10:3000',
      'http://localhost:3000',
      'http://www.grupocalafia.com.mx',
      'https://www.grupocalafia.com.mx',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.init();
  return server;
}

module.exports = bootstrap();