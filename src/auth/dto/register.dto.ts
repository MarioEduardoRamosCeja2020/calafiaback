import { IsString, IsEmail, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  Id_rol_usu: string;

  @IsString()
  NombreCompleto_usu: string;

  @IsDateString()
  FechaNacimiento_usu: string;

  @IsString()
  Login_usu: string;

  @IsString()
  Password_usu: string;

  @IsEmail()
  correo_elec_usu: string;

  @IsString()
  PassWord_correo_usu: string;

  @IsString()
  Id_suc_usu: string;
}
