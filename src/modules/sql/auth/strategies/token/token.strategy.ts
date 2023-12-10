import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { LoginLogService } from 'src/modules/mongo/login-log/login-log.service';
import { UserService } from '../../../user/user.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'authtoken') {
  constructor(
    private loginLogService: LoginLogService,
    private userService: UserService,
  ) {
    super();
  }

  async validate(req: Request, done: any) {
    try {
      const { error, data } = await this.loginLogService.$db.findOneRecord({
        options: {
          where: {
            token: req.body.refresh_token,
            token_expiry: { $gt: Date.now() },
            active: true,
          },
        },
      });
      if (!!error || !data) throw new UnauthorizedException();
      const { error: userError, data: userData } =
        await this.userService.$db.findRecordById({
          id: data.user_id,
          options: {
            allowEmpty: true,
          },
        });
      if (!!userError || !userData || !userData.getDataValue('active'))
        throw new UnauthorizedException();
      done(null, data);
    } catch (error) {
      done(error);
    }
  }
}
