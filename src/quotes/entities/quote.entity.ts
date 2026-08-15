import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { QuoteItemEntity } from './quote-item.entity'; // Ajusta la ruta según tu proyecto

@Entity('quotes')
export class QuoteEntity {
  @PrimaryGeneratedColumn()
  id: number; // 👈 Este es tu folio automático (1, 2, 3...)

  @Column()
  serie: string;

  @Column()
  sucursal: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  nombre_cliente: string;

  @Column()
  correo_cliente: string;

  @Column()
  tipo_cliente: string;

  @Column({ type: 'text' })
  ruta_origen: string;

  @Column({ type: 'bit' })
  domicilio: boolean;

  @Column('decimal', { precision: 10, scale: 3 })
  volumen_total: number;

  @Column('decimal', { precision: 12, scale: 2 })
  seguro: number;

  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2 })
  iva: number;

  @Column('decimal', { precision: 12, scale: 2 })
  ret_iva: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'text' })
  observaciones: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @OneToMany(() => QuoteItemEntity, (item) => item.quote)
  items: QuoteItemEntity[];
}