import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getClientIp } from 'request-ip';

/**
 * Decorator for fetching client's IP address from Request object
 *
 * ip string will be available for controller's methods as a parameter
 *```js
 * @GetIP() ip: string
 * ```
 * @return {object} user - req.user object
 */
export const GetIP = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return getClientIp(request);
  },
);
