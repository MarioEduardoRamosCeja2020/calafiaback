// src/results/results.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('searchBySerieFolio')
  async searchBySerieFolio(
    @Query('kindReport') kindReport: string,
    @Query('serie') serie: string,
    @Query('folio') folio: string,
  ) {
    return this.resultsService.searchBySerieFolio(kindReport, serie, folio);
  }
}
