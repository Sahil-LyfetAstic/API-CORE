import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ApiErrorResponses } from 'src/core/core.decorators';
import {
  BadRequest,
  ErrorResponse,
  Forbidden,
  Result,
} from 'src/core/core.responses';
import { Owner, OwnerDto } from 'src/core/decorators/mongo/owner.decorator';
import { Roles } from 'src/core/decorators/mongo/roles.decorator';
import { Public } from 'src/core/decorators/public.decorator';
import { LoginLog } from 'src/modules/mongo/login-log/entities/login-log.entity';
import { Role } from '../user/role.enum';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginAsDto } from './dto/login-as.dto';
import { LogoutDto } from './dto/logout.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenAuthDto } from './strategies/token/token-auth.dto';
import { TokenAuthGuard } from './strategies/token/token-auth.guard';

@ApiTags('auth')
@ApiErrorResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear session' })
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() body: LogoutDto,
  ) {
    if (!!body.session_id && !owner.sessionId) {
      owner.sessionId = body.session_id;
    }

    const token = req.headers?.authorization;
    await this.authService.clearSession(owner, token);
    return Result(res, { message: 'Logout' });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Login on behalf of another user (Admin)' })
  @Roles(Role.Admin)
  @Post('user')
  async loginAs(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() body: LoginAsDto,
  ) {
    const { error, data } = await this.authService.createUserSession(
      body.user_id,
      true,
      {},
    );
    if (!!error) {
      return Forbidden(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data, message: 'Login success' });
  }

  @Public()
  @ApiOperation({ summary: 'Get new token with refresh token' })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
            refresh_token: {
              type: 'string',
            },
            token_expiry: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        message: {
          type: 'string',
          example: 'Created',
        },
      },
    },
  })
  @UseGuards(TokenAuthGuard)
  @Post('token')
  async token(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: TokenAuthDto,
    @Owner() session: LoginLog,
  ) {
    const { error, data } = await this.authService.getNewToken(body, session);
    if (!!error) {
      return Forbidden(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data, message: 'Token created' });
  }

  @Public()
  @ApiOperation({ summary: 'Forgot password' })
  // @ApiHeader({ name: 'recaptcha' })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
            },
          },
        },
        message: {
          type: 'string',
          example: 'OTP sent',
        },
      },
    },
  })
  // @UseGuards(RecaptchaAuthGuard)
  @Post('password/forgot')
  async forgotPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ForgotPasswordDto,
  ) {
    const verifyEmail = await this.authService.verifyEmail(body.email);
    if (!!verifyEmail.error) {
      return BadRequest(res, {
        error: verifyEmail.error,
        message: `${verifyEmail.error.message || verifyEmail.error}`,
      });
    }
    const forgotOtp = await this.authService.forgotOtp(verifyEmail.data);
    if (!!forgotOtp.error) {
      return ErrorResponse(res, {
        error: forgotOtp.error,
        message: `${forgotOtp.error.message || forgotOtp.error}`,
      });
    }
    return Result(res, {
      data: { session_id: forgotOtp.data._id },
      message: 'OTP sent',
    });
  }

  @Public()
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
            },
          },
        },
        message: {
          type: 'string',
          example: 'OTP sent',
        },
      },
    },
  })
  @Post('otp/send')
  async sendOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SendOtpDto,
  ) {
    const verifyOtp = await this.authService.sendOtp(body);
    if (!!verifyOtp.error) {
      if (verifyOtp.errorCode === 403) {
        return Forbidden(res, {
          error: verifyOtp.error,
          message: `${verifyOtp.error.message || verifyOtp.error}`,
        });
      }
      return BadRequest(res, {
        error: verifyOtp.error,
        message: `${verifyOtp.error.message || verifyOtp.error}`,
      });
    }
    return Result(res, {
      data: {
        session_id: verifyOtp.data._id,
        resend_limit: verifyOtp.data.resend_limit,
      },
      message: 'OTP sent',
    });
  }

  @Public()
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
            },
          },
        },
        message: {
          type: 'string',
          example: 'OTP verified',
        },
      },
    },
  })
  @Post('otp/verify')
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: VerifyOtpDto,
  ) {
    const verifyOtp = await this.authService.verifyOtp(body);
    if (!!verifyOtp.error) {
      if (verifyOtp.errorCode === 403) {
        return Forbidden(res, {
          error: verifyOtp.error,
          message: `${verifyOtp.error.message || verifyOtp.error}`,
        });
      }
      return BadRequest(res, {
        error: verifyOtp.error,
        message: `${verifyOtp.error.message || verifyOtp.error}`,
      });
    }

    if (verifyOtp.data.type === 'Login') {
      const { error, data } = await this.authService.createUserSession(
        verifyOtp.data.user_id,
        false,
        verifyOtp.data.payload,
      );
      if (!!error) {
        return Forbidden(res, {
          error,
          message: `${error.message || error}`,
        });
      }
      return Result(res, { data, message: 'Login success' });
    }
    return Result(res, {
      data: { session_id: verifyOtp.data._id },
      message: 'OTP verified',
    });
  }

  @Public()
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Password changed',
        },
      },
    },
  })
  @Post('password/reset')
  async resetPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ResetPasswordDto,
  ) {
    const resetPassword = await this.authService.resetPassword(body);
    if (!!resetPassword.error) {
      return BadRequest(res, {
        error: resetPassword.error,
        message: `${resetPassword.error.message || resetPassword.error}`,
      });
    }
    return Result(res, {
      message: 'Password changed',
    });
  }
}
