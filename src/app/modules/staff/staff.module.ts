import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';

@Module({
  imports: [],
  controllers: [StaffController],
  providers: [],
  exports: [],
})
export class StaffModule {}
