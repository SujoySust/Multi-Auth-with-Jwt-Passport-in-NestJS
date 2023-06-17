import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../../models/db/user.model';
import { UserEntity } from '../../../libs/decorators/user.decorator';
import { JwtAuthGuard } from '../../../libs/auth/auth.gaurd';

@UseGuards(JwtAuthGuard())
@Controller()
export class UserController {
  @Get('/profile')
  async profile(@UserEntity() user: User): Promise<User> {
    return user;
  }
}
