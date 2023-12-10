import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OWNER_INCLUDE_ATTRIBUTES_KEY } from 'src/core/decorators/mongo/owner-attributes.decorator';
import { OWNER_INCLUDE_POPULATES_KEY } from 'src/core/decorators/mongo/owner-populates.decorator';
import { CachingService } from 'src/core/modules/caching/caching.service';
import { UserService } from '../../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private _config: ConfigService,
    private _user: UserService,
    private _cache: CachingService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _config.get('jwt').secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const token = req.headers['authorization'];
    if (
      await this._cache.isBlackListed({ sessionId: payload.sessionId, token })
    ) {
      throw new UnauthorizedException();
    }
    const { error, data } = await this._user.$db.findRecordById({
      id: payload.userId,
      options: {
        attributes: { include: req[OWNER_INCLUDE_ATTRIBUTES_KEY] },
        include: req[OWNER_INCLUDE_POPULATES_KEY],
        allowEmpty: true,
      },
    });
    if (!!error || !data || !data.active) {
      throw new UnauthorizedException();
    }
    return { ...data.toJSON(), ...payload };
  }
}
