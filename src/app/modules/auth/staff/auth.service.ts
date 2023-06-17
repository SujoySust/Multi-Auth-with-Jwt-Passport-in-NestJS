import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtHelper } from '../../../../libs/auth/jwt.helper';
import {
  __,
  errorResponse,
  prisma_client,
  processException,
  successResponse,
} from '../../../helpers/functions';

import { plainToClass } from 'class-transformer';
import { PasswordService } from '../../../../libs/auth/password.service';
import { AuthServiceInterface } from '../auth.interface';
import { LoginInput } from '../dto/input.dto';
import { LoginResponse } from '../dto/response.dto';
import { Staff } from '../../../models/db/staff.model';

@Injectable()
export class StaffAuthService implements AuthServiceInterface {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly passwordService: PasswordService,
  ) {}

  async login(payload: LoginInput): Promise<LoginResponse> {
    try {
      const { email, password } = payload;
      const staff: Staff = await prisma_client.staff.findFirst({
        where: {
          email: email,
        },
      });
      if (!staff) {
        throw new NotFoundException(errorResponse(__('Staff not found!')));
      }
      const passwordValid = await this.passwordService.validatePassword(
        password,
        staff.password,
      );
      if (!passwordValid) {
        throw new BadRequestException(errorResponse(__('Invalid password!')));
      }

      // Generate token with staff provider
      const { accessToken, refreshToken, expireAt } =
        this.jwtHelper.generateToken(
          {
            authIdentifier: String(staff.id),
          },
          'staff',
        );

      const res: LoginResponse = {
        ...successResponse(),
        message: __('Logged in successfully'),
        accessToken,
        refreshToken,
        expireAt,
        staff: plainToClass(Staff, staff, { excludeExtraneousValues: true }),
      };
      return res;
    } catch (e) {
      processException(e);
    }
  }

  async getUserFromToken(token: string): Promise<Staff> {
    const { authIdentifier } = this.jwtHelper.authIdentifierFromToken(token);
    return await prisma_client.staff.findUnique({
      where: { id: BigInt(authIdentifier) },
    });
  }

  async getUserByIdentifier(
    authIdentifier: string | number | bigint,
  ): Promise<Staff> {
    if (!authIdentifier) return null;

    return await prisma_client.staff.findFirst({
      where: {
        id: BigInt(authIdentifier),
      },
    });
  }

  refreshToken(token: string): LoginResponse {
    return <LoginResponse>this.jwtHelper.refreshToken(token);
  }
}
