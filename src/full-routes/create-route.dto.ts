import { IsString, IsOptional, IsNumber, IsDateString, Length } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @Length(1, 10)
  Nombre_rut: string;

  @IsNumber()
  Origen_rut: number;

  @IsNumber()
  Destino_rut: number;

  @IsOptional()
  @IsNumber()
  DistanciaKM_rut?: number;

  @IsOptional()
  @IsNumber()
  DuracionHoras_rut?: number;

  @IsOptional()
  @IsNumber()
  CuotaTonelada_rut?: number;

  @IsOptional()
  @IsNumber()
  CuotaAutopts_rut?: number;

  @IsOptional()
  @IsNumber()
  CuotaBarco_rut?: number;

  @IsOptional()
  @IsString()
  CobrarManiobra_rut?: string;

  @IsOptional()
  @IsString()
  Observaciones_rut?: string;

  @IsString()
  @Length(1, 1)
  Estatus_rut: string;

  @IsString()
  Documento_rut: string;

  @IsDateString()
  FechaActualizacion_rut: Date;

  @IsOptional()
  @IsNumber()
  Id_suc_rut?: number;
}
