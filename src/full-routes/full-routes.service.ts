import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FullRoute } from './full-routes.entity';

@Injectable()
export class FullRoutesService {
  constructor(
    @InjectRepository(FullRoute)
    private readonly fullRouteRepository: Repository<FullRoute>,
  ) {}

  // Obtener todas las rutas
  async getAllFullRoutes(): Promise<FullRoute[]> {
    return await this.fullRouteRepository.find();
  }

  // Obtener una ruta por ID
  async getFullRouteById(id: number): Promise<FullRoute> {
    const route = await this.fullRouteRepository.findOne({
      where: { Id_rut: id },
    });

    if (!route) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
    }

    return route;
  }
}
