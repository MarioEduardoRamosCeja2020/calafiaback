// src/users/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const result = await this.usersService.create(data);
    return {
      message: 'Usuario registrado correctamente',
      user: result,
    };
  }
}
