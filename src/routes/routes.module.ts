import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutaCotizador } from './route.entity'; 
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RutaCotizador ])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
