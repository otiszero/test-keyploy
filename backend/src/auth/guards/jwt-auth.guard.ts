import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser,
    info: { name?: string; message?: string } | null,
  ): TUser {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException(
        'Token đã hết hạn, vui lòng đăng nhập lại',
      );
    }
    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    if (info?.message === 'No auth token') {
      throw new UnauthorizedException('Không tìm thấy token xác thực');
    }
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
