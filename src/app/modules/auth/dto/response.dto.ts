import { ResponseModel } from '../../../models/custom/common.response.model';
import { Staff } from '../../../models/db/staff.model';
import { User } from '../../../models/db/user.model';

export class LoginResponse extends ResponseModel {
  accessToken?: string;
  refreshToken?: string;
  expireAt?: Date;
  user?: User;
  staff?: Staff;
}
