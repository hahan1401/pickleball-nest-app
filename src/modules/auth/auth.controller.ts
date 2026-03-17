import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public-api.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('social')
  @HttpCode(HttpStatus.OK)
  @Public()
  socialLogin(@Body('accessToken') accessToken: string) {
    return this.authService.facebookLogin(accessToken);
  }
}
