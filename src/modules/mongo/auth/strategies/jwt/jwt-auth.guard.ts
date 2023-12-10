import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/core/decorators/public.decorator';
import { OWNER_INCLUDE_ATTRIBUTES_KEY } from 'src/core/decorators/mongo/owner-attributes.decorator';
import { OWNER_INCLUDE_POPULATES_KEY } from 'src/core/decorators/mongo/owner-populates.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    request[OWNER_INCLUDE_ATTRIBUTES_KEY] = this.reflector.getAllAndOverride<
      string[]
    >(OWNER_INCLUDE_ATTRIBUTES_KEY, [context.getHandler(), context.getClass()]);
    request[OWNER_INCLUDE_POPULATES_KEY] = this.reflector.getAllAndOverride<
      string[]
    >(OWNER_INCLUDE_POPULATES_KEY, [context.getHandler(), context.getClass()]);
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user || !user.userId) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
