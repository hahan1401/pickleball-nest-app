import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('me')
  facebookLogin(@Body('accessToken') accessToken: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'facebook_login' }, accessToken),
    );
  }
}
