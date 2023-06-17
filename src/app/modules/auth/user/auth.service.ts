import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtHelper } from '../../../../libs/auth/jwt.helper';
import { USER_STATUS } from '../../../helpers/coreconstant';
import {
  __,
  createUserCode,
  errorResponse,
  getUUID,
  prisma_client,
  processException,
  successResponse,
} from '../../../helpers/functions';

import { plainToClass } from 'class-transformer';
import { PasswordService } from '../../../../libs/auth/password.service';
import { ResponseModel } from '../../../models/custom/common.response.model';
import { User, User as UserModel } from '../../../models/db/user.model';
import {
  AuthServiceInterface,
  RegisterableAuthServiceInterface,
} from '../auth.interface';
import { LoginInput, SignupInput } from '../dto/input.dto';
import { LoginResponse } from '../dto/response.dto';
import { Staff } from '../../../models/db/staff.model';

@Injectable()
export class AuthService
  implements AuthServiceInterface, RegisterableAuthServiceInterface
{
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly passwordService: PasswordService,
  ) {}

  async signup(payload: SignupInput): Promise<ResponseModel> {
    try {
      delete payload.password_confirm;
      await this.processSignUp(payload);
      return successResponse('Sign up successful!');
    } catch (e) {
      processException(e);
    }
  }

  async processSignUp(payload: SignupInput) {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );
    const userCode = createUserCode();
    return await prisma_client.user.create({
      data: {
        email: payload.email,
        usercode: userCode,
        password: hashedPassword,
        status: USER_STATUS.ACTIVE,
      },
    });
  }

  async login(payload: LoginInput): Promise<LoginResponse> {
    try {
      const email = payload.email || undefined;
      const user: User = await prisma_client.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new NotFoundException(errorResponse(__('User not found!')));
      }
      await this.checkPasswordValidity(payload, user);
      // return await this.processLogin(user);
      const { accessToken, refreshToken, expireAt } =
        this.jwtHelper.generateToken({
          authIdentifier: String(user.id),
        });
      const res: LoginResponse = {
        ...successResponse(),
        message: __('Logged in successfully'),
        accessToken,
        refreshToken,
        expireAt,
        user: plainToClass(User, user, { excludeExtraneousValues: true }),
      };
      return res;
    } catch (e) {
      processException(e);
    }
  }

  async checkPasswordValidity(payload, user) {
    const passwordValid = await this.passwordService.validatePassword(
      payload.password,
      user.password,
    );
    if (!passwordValid) {
      throw new BadRequestException(errorResponse(__('Invalid password')));
    }
  }

  async getUserFromToken(token: string): Promise<User> {
    const { authIdentifier } = this.jwtHelper.authIdentifierFromToken(token);
    return await prisma_client.user.findUnique({
      where: { id: BigInt(authIdentifier) },
    });
  }

  async getUserByIdentifier(
    authIdentifier: string | number | bigint,
  ): Promise<UserModel> {
    if (!authIdentifier) return null;
    const user = await prisma_client.user.findFirst({
      where: {
        id: BigInt(authIdentifier),
      },
    });

    return user;
  }

  refreshToken(token: string): LoginResponse {
    return <LoginResponse>this.jwtHelper.refreshToken(token);
  }

  async getUserByCode(usercode: string): Promise<UserModel> {
    try {
      const user = await prisma_client.user.findFirst({
        where: {
          usercode: usercode,
        },
      });
      if (!user) {
        throw new NotFoundException(errorResponse(__('No user not found!')));
      }
      return user;
    } catch (error) {
      processException(error);
    }
  }
}
