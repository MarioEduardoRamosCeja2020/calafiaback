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

  async searchBySerieFolio(
    kindReport: string,
    serie: string,
    folio: string,
  ) {
    try {
      // ============================================
      // CONSULTA 1: ESTATUS
      // ============================================
      const queryEstatus = `
        SELECT *
        FROM EstatusMercancia(@0, @1, @2)
      `;

      const estatus = await this.resultRepository.query(
        queryEstatus,
        [kindReport, serie, folio],
      );

      // ============================================
      // CONSULTA 2: MERCANCÍA
      // ============================================
      const queryMercancia = `
        SELECT
            dfcp.Numero AS CANTIDAD,
            cb.Nombre_cbul AS CLASE,
            dfcp.Contienen AS QUE_SE_DICE_QUE_CONTIENE
        FROM DatosFleteCartaPorte_vst AS dfcp
        INNER JOIN ClaseBulto AS cb
            ON cb.Id_cbul = dfcp.Id_cbul
        INNER JOIN CartaPorte_vst AS cp
            ON cp.Id_cp = dfcp.Id_doc
        INNER JOIN BloqueFolios AS bf
            ON bf.Id_suc_bfol = cp.Id_suc_cp
           AND bf.Id_tdoc_bfol = cp.Id_tdoc_cp
        WHERE cp.Numero_cp = @0
          AND bf.Serie_bfol = @1
          AND cp.Id_tdoc_cp = 4
          AND bf.Estatus_bfol = 'A'
      `;

      const mercancia = await this.resultRepository.query(
        queryMercancia,
        [
          folio,
          serie,
        ],
      );

      // ============================================
      // RESPUESTA
      // ============================================
      return {
        estatus,
        mercancia,
      };
    } catch (error) {
      console.error('❌ Error en searchBySerieFolio:', error);
      throw error;
    }
  }
}