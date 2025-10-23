// src/common/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendVerificationEmail(to: string, token: string, nombre: string) {
    const url = `http://localhost:3001/email/verify?token=${token}`;
    await this.mailer.sendMail({
      to,
      subject: 'Verifica tu correo',
      template: 'verify-email', // nombre de archivo de plantilla en templates/
      context: {
        nombre,
        url,
      },
    });
  }
}
