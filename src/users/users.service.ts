import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity'; // ✅ Correct import
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

    return user ?? undefined;
  }

  async findByEmail(email: string): Promise<Usuario | undefined> {
    const user = await this.userRepository.findOne({
      where: { correo_elec_usu: email },
    });

    return user ?? undefined;
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

  async update(id: number, updateData: Partial<Usuario>): Promise<Usuario> {
    // Ensure the user exists before updating
    const user = await this.userRepository.findOne({
      where: { Id_usu: id },  // Use the correct column name (Id_usu)
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    // Apply the update
    Object.assign(user, updateData);

    // Save and return the updated user
    return this.userRepository.save(user);
  }
}
