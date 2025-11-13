import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutaCotizador } from './route.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(RutaCotizador)
    private readonly rutaRepository: Repository<RutaCotizador>,
  ) {}

  findAll() {
    return this.rutaRepository.find();
  }

  findOne(id: number) {
    return this.rutaRepository.findOne({ where: { Id_rut: id } });
  }

  create(dto: CreateRouteDto) {
    const ruta = this.rutaRepository.create(dto);
    return this.rutaRepository.save(ruta); // INSERT funciona sin Id_rut
  }

  update(id: number, dto: UpdateRouteDto) {
    return this.rutaRepository.update(id, dto);
  }

  remove(id: number) {
    return this.rutaRepository.delete(id);
  }
}
