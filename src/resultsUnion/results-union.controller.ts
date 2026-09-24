import { Controller, Get, Query } from '@nestjs/common';

import { ResultsUnionService } from './results-union.service';

@Controller('resultsUnion')
export class ResultsUnionController {
  constructor(
    private readonly resultsUnionService: ResultsUnionService,
  ) {}

  @Get('searchBySerieFolio')
  async searchBySerieFolio(
    @Query('kindReport') kindReport: string,
    @Query('serie') serie: string,
    @Query('folio') folio: string,
  ) {
    return this.resultsUnionService.searchBySerieFolio(
      kindReport,
      serie,
      folio,
    );
  }
}
