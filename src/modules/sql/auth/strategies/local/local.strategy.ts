import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { trimAndValidate } from 'src/core/core.utils';
import { User } from 'src/modules/sql/user/entities/user.entity';
import { LocalAuthDto } from './local-auth.dto';
import { LocalAuthService } from './local-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: LocalAuthService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<User | never> {
    const { username, password } = await trimAndValidate(
      LocalAuthDto,
      req.body,
      ['password'],
    );
    const { error, user } = await this.authService.validateUser(
      username,
      password,
    );
    if (!!error) {
      throw new UnauthorizedException(error);
    }
    return user;
  }
}
