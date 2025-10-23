// src/auth/entities/email-token.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('email_verification_tokens')
export class EmailVerificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 510 })
  token: string;

  @Column({ type: 'datetime', nullable: true })
  createdAt: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId', referencedColumnName: 'Id_usu' })
  usuario: Usuario;
}
