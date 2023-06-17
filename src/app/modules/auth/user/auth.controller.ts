import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, SignupInput } from '../dto/input.dto';
import { ResponseModel } from '../../../models/custom/common.response.model';
import { LoginResponse } from '../dto/response.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() payload: SignupInput): Promise<ResponseModel> {
    return await this.authService.signup(payload);
  }

  @Post('/login')
  async login(@Body() payload: LoginInput): Promise<LoginResponse> {
    return await this.authService.login(payload);
  }
}
