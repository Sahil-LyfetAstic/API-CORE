import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as moment from 'moment-timezone';
import { JobResponse } from 'src/core/core.job';
import { generateHash, otp } from 'src/core/core.utils';
import { OwnerDto } from 'src/core/decorators/mongo/owner.decorator';
import { CachingService } from 'src/core/modules/caching/caching.service';
import { SessionService } from 'src/core/modules/session/session.service';
import { LoginLog } from 'src/modules/mongo/login-log/entities/login-log.entity';
import { LoginLogService } from 'src/modules/mongo/login-log/login-log.service';
import { OtpSessionType } from 'src/modules/mongo/otp-session/entities/otp-session.entity';
import { OtpSessionService } from 'src/modules/mongo/otp-session/otp-session.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenAuthDto } from './strategies/token/token-auth.dto';

export interface AuthResponse {
  error?: any;
  user?: User;
}

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private loginLogService: LoginLogService,
    private otpSessionService: OtpSessionService,
    private _cache: CachingService,
  ) {}

  async createSession(owner: OwnerDto, info: any): Promise<any> {
    try {
      const refreshToken = randomBytes(40).toString('hex');
      const { error, data } = await this.loginLogService.create({
        action: 'create',
        owner,
        body: {
          token: refreshToken,
          token_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          user_id: owner.id,
          info,
        },
      });
      if (!!error) return { error };
      const {
        token,
        tokenExpiry,
        error: tokenError,
      } = await this.sessionService.createToken({
        sessionId: data.id,
        userId: owner.id,
      });
      if (tokenError) {
        return { error: tokenError };
      }
      return {
        error: false,
        data: {
          token,
          token_expiry: tokenExpiry,
          refresh_token: refreshToken,
          user: owner,
          session_id: data._id,
        },
      };
    } catch (error) {
      return { error };
    }
  }

  async createUserSession(
    userId: string,
    isAdmin: boolean,
    info: any,
  ): Promise<any> {
    try {
      const userWhere: any = { id: userId };
      if (isAdmin) {
        userWhere.role = { $ne: 'Admin' };
      }
      const { error, data: user } = await this.userService.findOne({
        payload: {
          where: userWhere,
          allowEmpty: false,
        },
      });
      if (!!error) {
        return { error: 'Account does not exist' };
      } else {
        if (!user.active) {
          return { error: 'Account is inactive' };
        }
        const refreshToken = randomBytes(40).toString('hex');
        const { error, data } = await this.loginLogService.create({
          action: 'create',
          body: {
            token: refreshToken,
            token_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            user_id: user.id,
            info,
          },
        });
        if (!!error) return { error };
        const {
          token,
          tokenExpiry,
          error: tokenError,
        } = await this.sessionService.createToken({
          sessionId: data._id,
          userId,
        });
        if (tokenError) {
          return { error: tokenError };
        }
        return {
          error: false,
          data: {
            token,
            token_expiry: tokenExpiry,
            refresh_token: refreshToken,
            user,
            session_id: data._id,
          },
        };
      }
    } catch (error) {
      return { error };
    }
  }

  async createOtpSession(user: OwnerDto, payload?: any): Promise<JobResponse> {
    const { error, data } = await this.otpSessionService.create({
      body: {
        user_id: user.id,
        otp: otp(),
        type: OtpSessionType.Login,
        expire_at: new Date(Date.now() + 15 * 60 * 1000),
        payload,
      },
    });
    // TODO: send a email/sms notification
    return { error, data };
  }

  async getNewToken(tokens: TokenAuthDto, session: LoginLog): Promise<any> {
    try {
      const { decoded, error } = await this.sessionService.decodeToken(
        tokens.token,
      );
      if (error) {
        return { error };
      }
      if (
        decoded.sessionId !== String(session._id) ||
        decoded.userId !== session.user_id
      ) {
        return { error: 'Invalid token' };
      }
      const refreshToken = randomBytes(40).toString('hex');
      const { token, tokenExpiry } = await this.sessionService.createToken({
        sessionId: session.id,
        userId: session.user_id,
      });
      await this.loginLogService.update({
        id: session.id,
        body: {
          token: refreshToken,
        },
      });

      const authExp = new Date(decoded.exp * 1000);
      authExp.setHours(23, 59, 59, 999);
      const expireAt = authExp.getTime() - new Date().getTime();

      this._cache.addToBlackList({
        sessionId: session.id,
        token: tokens.token,
        expireAt,
      });

      return {
        error: false,
        data: { token, refresh_token: refreshToken, token_expiry: tokenExpiry },
      };
    } catch (error) {
      return { error };
    }
  }

  async clearSession(owner: OwnerDto, token: string) {
    const { exp, sessionId } = owner;
    await this.loginLogService.update({
      action: 'update',
      id: sessionId,
      body: {
        logout_at: moment().toDate(),
        active: false,
      },
    });

    const authExp = new Date(exp * 1000);
    authExp.setHours(23, 59, 59, 999);
    const authRedisExpiry = authExp.getTime() - new Date().getTime();
    await this._cache.addToBlackList({
      expireAt: Math.floor(authRedisExpiry),
      token,
      sessionId,
    });
  }

  async verifyEmail(email: string): Promise<JobResponse> {
    const { error, data } = await this.userService.findOne({
      payload: {
        where: { email },
        allowEmpty: true,
      },
    });
    if (!!error) {
      return { error };
    } else if (!!data) {
      if (!data.active) {
        return { error: 'Account is inactive' };
      }
      return { error: false, data };
    } else {
      return { error: 'Invalid email' };
    }
  }

  async forgotOtp(user: User): Promise<JobResponse> {
    const { error, data } = await this.otpSessionService.create({
      body: {
        user_id: user._id,
        otp: otp(),
        type: OtpSessionType.Forgot,
        expire_at: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    // TODO: send a email/sms notification
    return { error, data };
  }

  async verifyOtp(body: VerifyOtpDto): Promise<JobResponse> {
    const { error, data } = await this.otpSessionService.findById({
      id: body.session_id,
    });
    if (!!error) {
      return { error: 'Invalid session', errorCode: 403 };
    }
    if (
      !!data.verified ||
      moment(data.expire_at).diff(moment(), 'seconds') <= 0
    ) {
      return { error: 'Code expired', errorCode: 403 };
    }
    if (data.retry_limit <= 0) {
      return { error: 'Maximum number of retries exceeded', errorCode: 403 };
    }
    if (data.otp !== body.otp) {
      try {
        data.retry_limit--;
        await data.save();
        return { error: 'Invalid OTP' };
      } catch (error) {
        return { error };
      }
    }
    try {
      data.verified = true;
      await data.save();
      return { error: false, data };
    } catch (error) {
      return { error };
    }
  }

  async sendOtp(body: SendOtpDto): Promise<JobResponse> {
    const { error, data } = await this.otpSessionService.findById({
      id: body.session_id,
    });
    if (!!error) {
      return { error: 'Invalid session', errorCode: 403 };
    }
    if (
      !!data.verified ||
      moment(data.expire_at).diff(moment(), 'seconds') <= 0
    ) {
      return { error: 'Code expired', errorCode: 403 };
    }
    if (data.resend_limit <= 0) {
      return { error: 'Maximum number of retries exceeded' };
    }
    try {
      // data.expire_at = moment().add(15, 'minutes');
      data.resend_limit--;
      await data.save();
    } catch (error) {
      return { error };
    }

    // if (data.type === 'Forgot') {
    //   // TODO: send a email/sms notification for forgot_password
    // } else if (data.type === 'Login') {
    //   // TODO: send a 2fa_otp login notification
    // }
    return { error: false, data };
  }

  async resetPassword(body: ResetPasswordDto): Promise<JobResponse> {
    const otpSession = await this.otpSessionService.findById({
      id: body.session_id,
    });
    if (!!otpSession.error || !otpSession.data.verified) {
      return { error: 'Invalid session', errorCode: 403 };
    }
    if (moment(otpSession.data.expire_at).diff(moment(), 'seconds') <= 0) {
      return { error: 'Session expired', errorCode: 403 };
    }
    const userUpdate = await this.userService.update({
      id: otpSession.data.user_id,
      body: {
        password: await generateHash(body.password),
      },
    });
    if (!!userUpdate.error) {
      return { error: 'Unable to change password, Please try again' };
    }
    await this.otpSessionService.delete({
      id: body.session_id,
    });
    return { error: false };
  }
}
