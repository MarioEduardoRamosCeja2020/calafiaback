// src/auth/email-verification/email-verification.controller.ts
import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { VerifyEmailService } from './verify-email.service';
import type { Response } from 'express';


@Controller('email')
export class EmailVerificationController {
  constructor(private readonly verifyEmailService: VerifyEmailService) {}

  @Get('verify')
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      const result = await this.verifyEmailService.verifyEmail(token);
      return res.status(HttpStatus.OK).send(result);
    } catch (err) {
      return res.status(err.status || 500).send(err.message || 'Error interno');
    }
  }
}
