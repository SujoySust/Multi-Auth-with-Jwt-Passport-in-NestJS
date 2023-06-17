import { registerAs } from '@nestjs/config';
import { User } from '../app/models/db/user.model';
import { AuthConfig as AuthConfigInterface } from './config.interface';
import { AuthService } from '../app/modules/auth/user/auth.service';
import { Staff } from '../app/models/db/staff.model';
import { StaffAuthService } from '../app/modules/auth/staff/auth.service';

export const AuthConfig = registerAs(
  'auth',
  (): AuthConfigInterface => ({
    default: 'user',
    providers: {
      user: {
        model: User,
        service: AuthService,
      },
      staff: {
        model: Staff,
        service: StaffAuthService,
      },
    },
  }),
);
