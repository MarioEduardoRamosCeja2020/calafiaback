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
        // secure: false,
        auth: {
          user: 'calafia.soporte@grupocalafia.com.mx',
          pass: '33.M@iltcala',
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
