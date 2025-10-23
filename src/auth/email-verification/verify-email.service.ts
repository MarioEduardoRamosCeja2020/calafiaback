import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationToken } from './email-token.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/users/entities/usuario.entity';
import { UsersService } from 'src/users/users.service';
import { randomBytes } from 'crypto';

// IMPORTA aquí tu servicio de correo, por ejemplo:
// import { MailService } from 'src/mail/mail.service';

@Injectable()
export class VerifyEmailService {
  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly tokenRepo: Repository<EmailVerificationToken>,
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,
    private readonly usersService: UsersService,
    // private readonly mailService: MailService,  <-- inyecta el servicio de email
  ) {}

  // Genera y guarda un token para el usuario
  async generateVerificationToken(userId: number): Promise<string> {
    const token = randomBytes(32).toString('hex');

    const user = await this.userRepo.findOneBy({ Id_usu: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const verificationToken = this.tokenRepo.create({
      token,
      usuario: user, // Aquí asignas el usuario relacionado
    });

    await this.tokenRepo.save(verificationToken);
    return token;
  }

  // Verifica el correo con el token
  async verifyEmail(token: string): Promise<string> {
    const record = await this.tokenRepo.findOne({
      where: { token },
      relations: ['usuario'], // Para traer el usuario relacionado
    });

    if (!record) throw new NotFoundException('Token no válido o expirado');

    const user = record.usuario;
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Supongamos que el campo de verificación es booleano, no texto.
    if (user.isEmailVerified) { 
      throw new ConflictException('El correo ya fue verificado');
    }

    user.isEmailVerified = true; // Mejor usar un booleano para la verificación
    await this.userRepo.save(user);
    await this.tokenRepo.delete({ id: record.id });

    return 'Correo verificado correctamente';
  }

  // Envía correo de verificación (requiere mailService)
  async sendVerificationEmail(user: Usuario) {
    const token = await this.generateVerificationToken(user.Id_usu);

    // Aquí llamas al método de tu servicio de correo
    // await this.mailService.sendVerificationEmail(user.correo_elec_usu, token, user.NombreCompleto_usu);

    return { message: 'Correo de verificación enviado' };
  }
}
