import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendQuote(to: string, pdfBuffer: Buffer, folio: number, htmlContent: string) {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: `Cotización Calafia Logística - Folio ${folio}`,
        html: htmlContent, // Recibe el diseño desde el QuotesService
        attachments: [
          {
            filename: `Cotizacion_${folio}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      console.log(`Email enviado con éxito al folio: ${folio}`);
    } catch (error) {
      console.error('Error enviando mail:', error);
      throw error;
    }
  }
}