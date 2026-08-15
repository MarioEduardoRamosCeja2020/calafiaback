export class CreateRouteDto {
  Nombre_rut: string;
  Origen_rut: number;
  Destino_rut: number;
  DistanciaKM_rut: number;
  DuracionHoras_rut: number;
  CuotaTonelada_rut?: number;
  CuotaAutopts_rut?: number;
  CuotaBarco_rut?: number;
  CobrarManiobra_rut?: string;
  Observaciones_rut?: string;
  Estatus_rut: string;
  Documento_rut: string;
  FechaActualizacion_rut: Date;
  Id_suc_rut: number;
}
