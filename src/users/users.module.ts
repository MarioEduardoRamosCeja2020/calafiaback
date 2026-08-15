import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from './entities/usuario.entity'; // <- asegúrate de que esta ruta sea correcta

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // <- IMPORTANTE
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <- para que otros módulos puedan usarlo
})
export class UsersModule {}
