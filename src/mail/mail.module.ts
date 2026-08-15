// src/mail/mail.module.ts

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mail.grupocalafia.com.mx',
        port: 587,
        secure: false, // Usar false para puerto 587
        auth: {
          user: 'calafia.soporte@grupocalafia.com.mx',
          pass: '33.M@iltcala', // <--- Asegúrate de poner la clave
        },
        tls: {
          // Esto ayuda si el servidor de grupocalafia tiene certificados auto-firmados
          rejectUnauthorized: false 
        }
      },
      defaults: {
        // IMPORTANTE: Esto evita que el correo salga como "localhost"
        from: '"Soporte Calafia" <calafia.soporte@grupocalafia.com.mx>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}