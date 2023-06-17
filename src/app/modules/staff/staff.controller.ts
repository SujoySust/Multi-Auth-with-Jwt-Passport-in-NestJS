import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from '../../../libs/decorators/user.decorator';
import { JwtAuthGuard } from '../../../libs/auth/auth.gaurd';
import { Staff } from '../../models/db/staff.model';

@UseGuards(JwtAuthGuard('staff'))
@Controller('staff')
export class StaffController {
  @Get('/profile')
  async profile(@UserEntity() staff: Staff): Promise<Staff> {
    return staff;
  }
}
