import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
  ) {}

  async searchBySerieFolio(kindReport: string, serie: string, folio: string): Promise<Result[]> {
    try {
      const query = `
        SELECT * FROM EstatusMercancia(@0, @1, @2)
      `;

      const results = await this.resultRepository.query(query, [kindReport, serie, folio]);
      return results;

    } catch (error) {
      console.error('❌ Error en searchBySerieFolio:', error);
      throw error;
    }
  }
}
