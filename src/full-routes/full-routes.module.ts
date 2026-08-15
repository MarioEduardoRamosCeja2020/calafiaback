import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FullRoute } from './full-routes.entity';
import { FullRoutesService } from './full-routes.service';
import { FullRoutesController } from './full-routes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FullRoute])],
  providers: [FullRoutesService],
  controllers: [FullRoutesController],
})
export class FullRoutesModule {}
