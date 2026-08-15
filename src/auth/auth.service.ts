import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailVerificationToken } from './email-verification/email-token.entity';
import { Patch } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(EmailVerificationToken)
    private readonly tokenRepo: Repository<EmailVerificationToken>,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByLogin(loginDto.Login_usu);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const passwordValid = await bcrypt.compare(loginDto.Password_usu, user.Password_usu);
    if (!passwordValid) throw new UnauthorizedException('Credenciales inválidas');

    const { Password_usu, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { username: user.Login_usu, sub: user.Id_usu };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingByEmail = await this.usersService.findByEmail(registerDto.correo_elec_usu);
    if (existingByEmail) throw new ConflictException('El correo electrónico ya está registrado');

    const existing = await this.usersService.findByLogin(registerDto.Login_usu);
    if (existing) throw new ConflictException('El nombre de usuario ya está en uso');

    const hashedPassword = await bcrypt.hash(registerDto.Password_usu, 10);
    const user = await this.usersService.create({
      ...registerDto,
      Password_usu: hashedPassword,
    });

    const { Password_usu, ...result } = user;
    return {
      message: 'Usuario registrado correctamente',
      user: result,
    };
  }

  // ✅ Recuperación de contraseña real
  // async forgotPassword(email: string) {
  //   try {
  //     const user = await this.usersService.findByEmail(email);
  //     if (!user) throw new UnauthorizedException('Correo no registrado');

  //     const token = crypto.randomBytes(32).toString('hex');
  //     const resetToken = this.tokenRepo.create({ usuario: user, token });
  //     await this.tokenRepo.save(resetToken);

  //     const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  //     const transporter = nodemailer.createTransport({
  //       host: 'smtp.grupocalafia.com.mx',
  //       port: 587,
  //       secure: false,
  //       auth: {
  //         user: 'calafia.soporte@grupocalafia.com.mx',
  //         pass: '33.M@iltcala', // 🔒 REEMPLAZA ESTO POR UNA VARIABLE DE ENTORNO
  //       },
  //     });

  //     await transporter.sendMail({
  //       from: '"Calafia" <no-reply@calafia.com>',
  //       to: email,
  //       subject: 'Recupera tu contraseña',
  //       html: `
  //         <div style="font-family: sans-serif; padding: 20px;">
  //           <h2 style="color: #00004e;">Recupera tu contraseña</h2>
  //           <p>Haz clic en el botón para restablecer tu contraseña:</p>
  //           <a href="${resetUrl}" style="display: inline-block; background: #00004e; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">Restablecer contraseña</a>
  //           <p style="margin-top: 20px;">Si no solicitaste esto, ignora este mensaje.</p>
  //         </div>
  //       `,
  //     });

  //     return {
  //       message: 'Correo de recuperación enviado.',
  //     };
  //   } catch (error) {
  //     console.error('❌ Error en forgotPassword:', error);
  //     throw new InternalServerErrorException('Error al enviar el correo');
  //   }
  // }


      async forgotPassword(email: string) {
      console.log('📩 Email recibido en forgotPassword:', email);

      try {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Correo no registrado');

        const token = crypto.randomBytes(32).toString('hex');

        const resetToken = this.tokenRepo.create({
          usuario: user,
          token,
        });

        await this.tokenRepo.save(resetToken);

            const resetUrl = `http://localhost:3001/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
          host: 'mail.grupocalafia.com.mx',
          port: 587,
          secure: false,
          auth: {
            user: 'calafia.soporte@grupocalafia.com.mx',
            pass: '33.M@iltcala', // ← cámbiala por una válida si aún no lo haces
          },
        });

        const info = await transporter.sendMail({
          from: '"Calafia" <no-reply@calafia.com>',
          to: email,
          subject: 'Recupera tu contraseña',
          html: `
            <h2>Recuperación</h2>
            <p>Haz clic aquí: <a href="${resetUrl}">${resetUrl}</a></p>
          `,
        });

        console.log('📤 Correo enviado:', info.messageId);

        return {
          message: 'Correo de recuperación enviado.',
        };
      } catch (error) {
        console.error('❌ ERROR COMPLETO en forgotPassword:', error); // 👈 muestra toda la info
        throw new InternalServerErrorException('Error al enviar el correo');
      }
    }

      

    async resetPassword(token: string, newPassword: string) {
    const tokenRecord = await this.tokenRepo.findOne({
      where: { token },
      relations: ['usuario'],
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    tokenRecord.usuario.Password_usu = hashedPassword;

    // Guardar el nuevo password
    await this.usersService.update(tokenRecord.usuario.Id_usu, {
      Password_usu: hashedPassword,
    });

    // Eliminar el token usado
    await this.tokenRepo.delete({ id: tokenRecord.id });

    return { message: 'Contraseña actualizada correctamente' };
  }

}
