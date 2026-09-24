import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResultsUnionController } from './results-union.controller';
import { ResultsUnionService } from './results-union.service';

import { Result } from '../results/entities/result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Result],
      'conexionSecundaria',
    ),
  ],

  controllers: [
    ResultsUnionController,
  ],

  providers: [
    ResultsUnionService,
  ],
})
export class ResultsUnionModule {}
