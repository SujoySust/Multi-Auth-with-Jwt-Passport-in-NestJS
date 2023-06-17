import { ResponseModel } from '../../models/custom/common.response.model';
import { Staff } from '../../models/db/staff.model';
import { User } from '../../models/db/user.model';
import { LoginInput, SignupInput } from './dto/input.dto';
import { LoginResponse } from './dto/response.dto';

export interface RegisterableAuthServiceInterface {
  signup(payload: SignupInput): Promise<LoginResponse | ResponseModel>;
}

export interface AuthServiceInterface {
  login(payload: LoginInput): Promise<LoginResponse>;
  getUserByIdentifier(
    authIdentifier: string | number | bigint,
  ): Promise<User | Staff>;
  getUserFromToken(token: string): Promise<User | Staff>;
  refreshToken(token: string): LoginResponse;
}
