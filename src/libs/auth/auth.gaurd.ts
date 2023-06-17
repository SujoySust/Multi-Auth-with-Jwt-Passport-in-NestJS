import {
  CanActivate,
  Inject,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { __, errorResponse } from '../../app/helpers/functions';
import { AuthGuard } from '@nestjs/passport';
import { USER_STATUS } from '../../app/helpers/coreconstant';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../configs/config.interface';

export function JwtAuthGuard(authProvider?: string): Type<CanActivate> {
  class MixingAuthGuard extends AuthGuard('jwt') {
    @Inject(ConfigService) private readonly configService: ConfigService;
    handleRequest(err: any, userInfo: any) {
      if (err || !userInfo) {
        throw err || new UnauthorizedException();
      } else {
        const { user, provider } = userInfo;
        const exactAuthProvider =
          authProvider || this.configService.get<AuthConfig>('auth').default;
        if (provider === exactAuthProvider) {
          return this.checkStatusAndGetUser(user);
        } else {
          throw new UnauthorizedException();
        }
      }
    }
    checkStatusAndGetUser(user: any) {
      if (user.status == USER_STATUS.ACTIVE) return user;
      else if (user.status == USER_STATUS.SUSPENDED)
        throw new UnauthorizedException(
          errorResponse(__('The account is suspended. Contact to support')),
        );
      else if (user.status == USER_STATUS.DISABLED)
        throw new UnauthorizedException(
          errorResponse(__('The account is disabled. Contact to support')),
        );
      else if (user.status == USER_STATUS.INACTIVE)
        throw new UnauthorizedException(
          errorResponse(__('The account is not active. Contact to support')),
        );
    }
  }
  const guard = mixin(MixingAuthGuard);
  return guard;
}
