// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_SECRETO_FUERTE_AQUI', // Igual que en JwtModule
    });
  }

  async validate(payload: any) {
    // Payload contiene los datos que pusiste en el token
    return { userId: payload.sub, username: payload.username };
  }
}
