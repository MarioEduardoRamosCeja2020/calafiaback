import { Controller, Get, Param } from '@nestjs/common';
import { FullRoutesService } from './full-routes.service';
import { FullRoute } from './full-routes.entity';

@Controller('full-routes')
export class FullRoutesController {
  constructor(private readonly fullRoutesService: FullRoutesService) {}

  @Get()
  async getAllFullRoutes(): Promise<FullRoute[]> {
    return this.fullRoutesService.getAllFullRoutes();
  }

  @Get(':id')
  async getFullRouteById(@Param('id') id: number): Promise<FullRoute | null> {
    return this.fullRoutesService.getFullRouteById(id);
  }
}
