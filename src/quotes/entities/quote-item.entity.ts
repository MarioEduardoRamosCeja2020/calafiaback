import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { QuoteEntity } from './quote.entity';

@Entity('quote_items')
export class QuoteItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔗 Relación con quotes
  @ManyToOne(() => QuoteEntity, quote => quote.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quote_id' })
  quote: QuoteEntity;

  // 📦 Datos del artículo
  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'varchar', length: 150 })
  tipo_carga: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contenido: string;

  // 📐 Medidas
  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  largo: number;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  alto: number;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  ancho: number;

  // 📊 Volumen
  @Column('decimal', { precision: 10, scale: 3 })
  volumen_total: number;

  // 🕒 Fecha creación
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
