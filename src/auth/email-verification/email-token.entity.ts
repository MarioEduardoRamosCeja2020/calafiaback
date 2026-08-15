import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('email_verification_tokens')
export class EmailVerificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' }) // Asegúrate que este sea el nombre correcto de la columna FK en tu tabla
  usuario: Usuario;
}
