import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
    info: Error | { message: string } | undefined,
  ): TUser {
    if (
      info instanceof Error ||
      (info && typeof info === 'object' && 'message' in info)
    ) {
      console.error('JWT Auth Error:', info.message);
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
