import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kindReport: string;

  @Column()
  serie: string;

  @Column()
  folio: string;

  // Agrega más columnas si es necesario
}
