import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMS_KEY } from '../decorators/permissions.decorator';

interface UserPayload {
  userId: number;
  email: string;
  roles: string[];
  permissions: string[];
}

interface RequestWithUser extends Request {
  user: UserPayload;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMS_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!required) return true;

    const req = ctx.switchToHttp().getRequest<RequestWithUser>();

    const userPerms = req.user?.permissions ?? [];

    return required.every((permission) => userPerms.includes(permission));
  }
}
