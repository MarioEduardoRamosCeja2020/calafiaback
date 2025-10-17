// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // 👈 importante
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, JwtModule.register({ secret: 'secretKey' })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
