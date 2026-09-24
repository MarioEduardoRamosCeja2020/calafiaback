import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Result } from '../results/entities/result.entity';

@Injectable()
export class ResultsUnionService {
  constructor(
    @InjectRepository(Result, 'conexionSecundaria')
    private readonly resultRepository: Repository<Result>,
  ) {}

  async searchBySerieFolio(
    kindReport: string,
    serie: string,
    folio: string,
  ): Promise<{
    estatus: any[];
    mercancia: any[];
  }> {
    try {
      // ============================================
      // LIMPIEZA DE PARÁMETROS
      // ============================================
      // Elimina comillas simples o dobles sobrantes por si el navegador o cliente las manda codificadas
      const cleanKindReport = kindReport 
        ? kindReport.replace(/['"]+/g, '').trim() 
        : '';

      console.log('========== HTTP LIMPIO ==========');
      console.log('kindReport original:', kindReport);
      console.log('kindReport limpio:', cleanKindReport);
      console.log('serie:', serie);
      console.log('folio:', folio);

      // ============================================
      // CONSULTA 1: ESTATUS
      // ============================================

      const queryEstatus = `
        SELECT *
        FROM EstatusMercancia(@0, @1, @2)
      `;

      const estatus = await this.resultRepository.query(
        queryEstatus,
        [
          cleanKindReport,
          serie,
          folio,
        ],
      );

      // Si no existe el documento, no consultamos mercancía
      if (!estatus.length) {
        console.log('⚠️ [resultsUnion] No se encontraron registros de estatus.');
        return {
          estatus: [],
          mercancia: [],
        };
      }

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
           AND bf.Estatus_bfol = 'A'
        WHERE cp.Numero_cp = @0
          AND bf.Serie_bfol = @1
          AND cp.Id_tdoc_cp = 4
      `;

      const mercancia = await this.resultRepository.query(
        queryMercancia,
        [
          folio,
          serie,
        ],
      );

      // ============================================
      // LOGS
      // ============================================

      console.log(
        '📦 [resultsUnion] ESTATUS:',
        estatus,
      );

      console.log(
        '📦 [resultsUnion] MERCANCIA:',
        mercancia,
      );

      // ============================================
      // RESPUESTA
      // ============================================

      return {
        estatus,
        mercancia,
      };
    } catch (error) {
      console.error(
        '❌ [resultsUnion] Error en searchBySerieFolio:',
        error,
      );

      throw error;
    }
  }
}