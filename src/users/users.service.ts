// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  ) {}

  async findByLogin(login: string): Promise<Usuario | undefined> {
    const user = await this.userRepository.findOne({
      where: { Login_usu: login },
    });

    return user ?? undefined; // ✅ evita el error de asignación de null
  }

  async create(data: RegisterDto): Promise<Usuario> {
    const user = this.userRepository.create({
      ...data,
      Id_rol_usu: Number(data.Id_rol_usu),
      Id_suc_usu: Number(data.Id_suc_usu),
      FechaNacimiento_usu: new Date(data.FechaNacimiento_usu),
    });

    return await this.userRepository.save(user);
  }
}
