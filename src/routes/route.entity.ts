import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('RutaCotizador')
export class RutaCotizador {
  @PrimaryGeneratedColumn() // Ahora sí TypeORM sabe que es autoincremental
  Id_rut: number;

  @Column()
  Nombre_rut: string;

  @Column()
  Origen_rut: number;

  @Column()
  Destino_rut: number;

  @Column('decimal')
  DistanciaKM_rut: number;

  @Column('decimal')
  DuracionHoras_rut: number;

  @Column('decimal', { nullable: true })
  CuotaTonelada_rut?: number;

  @Column('decimal', { nullable: true })
  CuotaAutopts_rut?: number;

  @Column('decimal', { nullable: true })
  CuotaBarco_rut?: number;

  @Column({ nullable: true })
  CobrarManiobra_rut?: string;

  @Column({ nullable: true })
  Observaciones_rut?: string;

  @Column()
  Estatus_rut: string;

  @Column()
  Documento_rut: string;

  @Column()
  FechaActualizacion_rut: Date;

  @Column()
  Id_suc_rut: number;
}
