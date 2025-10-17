import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  Login_usu: string;

  @IsString()
  Password_usu: string;
}
