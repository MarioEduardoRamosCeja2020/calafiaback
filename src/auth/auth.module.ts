import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';
import { Usuario } from '../users/entities/usuario.entity';

import { EmailVerificationToken } from './email-verification/email-token.entity';
import { VerifyEmailService } from './email-verification/verify-email.service';
import { EmailVerificationController } from './email-verification/email-verification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, EmailVerificationToken]),
    UsersModule,
    JwtModule.register({
      secret: 'tu_secreto', // ⚠️ Usa una variable de entorno luego
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, EmailVerificationController],
  providers: [AuthService, VerifyEmailService],
})
export class AuthModule {}
