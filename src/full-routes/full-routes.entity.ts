import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Definición de la entidad FullRoute
@Entity('RutaCotizador_vst')
export class FullRoute {
  @PrimaryGeneratedColumn()
  Id_rut: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  Nombre_rut: string;

  @Column({ type: 'int', nullable: false })
  Origen_rut: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  CiudadO: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  EstadoO?: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  PaisO: string;

  @Column({ type: 'int', nullable: false })
  Destino_rut: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  CiudadD: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  EstadoD?: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  PaisD: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  DistanciaKM_rut?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  DuracionHoras_rut?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  CuotaTonelada_rut: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  CuotaAutopts_rut?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  CuotaBarco_rut?: number;

  @Column({ type: 'varchar', length: 2, nullable: true })
  CobrarManiobra_rut?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Observaciones_rut?: string;

  @Column({ type: 'varchar', length: 1, nullable: false })
  Estatus_rut: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  Documento_rut: string;

  @Column({ type: 'datetime', nullable: false })
  FechaActualizacion_rut: Date;

  @Column({ type: 'tinyint', nullable: false })
  id_suc_rut: number;

  @Column({ type: 'varchar', length: 14, nullable: false })
  Reporte: string;
}
