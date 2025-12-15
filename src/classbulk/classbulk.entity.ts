import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ClaseBulto')
export class ClassBulk {

  @PrimaryGeneratedColumn({ name: 'Id_cbul' })
  id: number;

  @Column({ name: 'Nombre_cbul', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'Observaciones_cbul', type: 'varchar', nullable: true })
  observations: string;

  @Column({ name: 'Estatus_cbul', type: 'varchar', length: 50 })
  status: string;

  @Column({ name: 'Documento_cbul', type: 'varchar', nullable: true })
  document: string;

  @Column({ name: 'FechaActualizacion_cbul', type: 'datetime' })
  updatedAt: Date;
}
