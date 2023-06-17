import { Module } from '@nestjs/common';
import { AuthLibraryModule } from '../../../libs/auth/auth.library.module';
import { AuthService } from './user/auth.service';
import { AuthController } from './user/auth.controller';
import { StaffAuthController } from './staff/auth.controller';
import { StaffAuthService } from './staff/auth.service';

@Module({
  imports: [AuthLibraryModule],
  controllers: [AuthController, StaffAuthController],
  providers: [AuthService, StaffAuthService],
})
export class AuthModule {}
