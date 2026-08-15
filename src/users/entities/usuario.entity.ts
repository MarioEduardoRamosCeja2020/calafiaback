import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EmailVerificationToken } from '../../auth/email-verification/email-token.entity';

@Entity('usuarios') // Asegúrate de usar el nombre real de la tabla
export class Usuario {
  @PrimaryGeneratedColumn()
  Id_usu: number;

  @Column({ type: 'int' })
  Id_rol_usu: number;

  @Column({ type: 'varchar', length: 50 })
  NombreCompleto_usu: string;

  @Column({ type: 'datetime', nullable: true })
  FechaNacimiento_usu: Date;

  @Column({ type: 'varchar', length: 80, unique: true })
  Login_usu: string;

  @Column({ type: 'varchar', length: 255 }) // Aumentamos el largo para almacenar hash de bcrypt
  Password_usu: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo_elec_usu: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // También recomendable aumentar longitud
  PassWord_correo_usu: string;

  @Column({ type: 'tinyint', nullable: true })
  Id_suc_usu: number;

  @Column({ type: 'bit', default: false })
  isEmailVerified: boolean;

  @OneToMany(() => EmailVerificationToken, (token) => token.usuario)
  verificationTokens: EmailVerificationToken[];
}
