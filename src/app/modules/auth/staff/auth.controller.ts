import { Body, Controller, Post } from '@nestjs/common';
import { LoginInput } from '../dto/input.dto';
import { StaffAuthService } from './auth.service';
import { LoginResponse } from '../dto/response.dto';
@Controller()
export class StaffAuthController {
  constructor(private readonly authService: StaffAuthService) {}

  @Post('staff/login')
  async login(@Body() payload: LoginInput): Promise<LoginResponse> {
    return await this.authService.login(payload);
  }
}
