import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.user.ip = request.connection.remoteAddress;
    console.log('CurrentUser decorator called. User info:', request.user);
    return request.user;
  },
);
