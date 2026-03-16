import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('social')
  @HttpCode(HttpStatus.OK)
  socialLogin(@Body('accessToken') accessToken: string) {
    return this.authService.facebookLogin(accessToken);
  }
}
