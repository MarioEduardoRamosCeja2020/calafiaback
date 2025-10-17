// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // ✅ asegúrate de importar esto
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // ✅ esta es la forma correcta
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByLogin(loginDto.Login_usu); // 👈 CORREGIDO

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(
      loginDto.Password_usu,
      user.Password_usu,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

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

    if (existingByEmail) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    const existing = await this.usersService.findByLogin(registerDto.Login_usu);
    if (existing) {
      throw new UnauthorizedException('El usuario ya existe');
    }
    // auth.service.ts

    const hashedPassword = await bcrypt.hash(registerDto.Password_usu, 10);

    const user = await this.usersService.create({
      ...registerDto,
      Password_usu: hashedPassword,
    });

    const { Password_usu, ...result } = user;

    return {
      message: 'Usuario registrado correctamente',
      user: result,
    }; // 👈 Este es el return que debe ir
  }

}
