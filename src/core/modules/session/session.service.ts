import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import * as moment from 'moment-timezone';

@Injectable()
export class SessionService {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  async createToken(payload: any) {
    try {
      const { secret, signOptions } = this.config.get<JwtModuleOptions>('jwt');
      const token = this.jwt.sign(payload, {
        secret,
      });
      const tokenExpiry = moment().add(signOptions.expiresIn, 'seconds');
      return { token, tokenExpiry };
    } catch (error) {
      return { error };
    }
  }

  verifyToken(token: string) {
    try {
      const { secret } = this.config.get<JwtModuleOptions>('jwt');
      const data = this.jwt.verify(token, {
        secret,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async decodeToken(token: string) {
    try {
      const { secret } = this.config.get<JwtModuleOptions>('jwt');
      const decoded: any = this.jwt.verify(token, {
        secret,
        ignoreExpiration: true,
      });
      return { decoded };
    } catch (error) {
      return { error };
    }
  }
}
