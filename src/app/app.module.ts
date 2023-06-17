import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [AuthModule, UserModule, StaffModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
