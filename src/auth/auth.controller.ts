import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('me')
  async facebookLoginFromMobile(@Body('accessToken') accessToken: string) {
    return this.authService.facebookLogin(accessToken);
  }
}
