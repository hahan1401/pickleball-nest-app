import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'changeme'),
    });
  }

  async validate(payload: {
    id: number;
    facebookUserId: string;
    email: string;
  }) {
    return {
      id: payload.id,
      facebookUserId: payload.facebookUserId,
      email: payload.email,
    };
  }
}
