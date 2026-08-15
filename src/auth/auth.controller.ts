// import { Controller, Post, Body } from '@nestjs/common';
import { Controller, Patch, Body, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto); // 👈 Aquí se retorna el `result`
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Patch('reset-password')
  async resetPassword(
  @Body() body: { token: string; newPassword: string },) {
   return this.authService.resetPassword(body.token, body.newPassword);
  }

}



