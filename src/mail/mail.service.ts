import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // this.transporter = nodemailer.createTransport({
    //   service: 'mail.grupocalafia.com.mx',
    //   auth: {
    //     user: 'calafia.soporte@grupocalafia.com.mx',      // Cambia a tu correo
    //     pass: '33.M@iltcala',       // Cambia a tu contraseña o app password
    //   },
    // });
  }

  
}
