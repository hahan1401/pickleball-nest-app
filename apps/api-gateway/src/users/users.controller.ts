import { CurrentUser } from '@app/common';
import { Public } from '@app/common/decorators/public-api.decorator';
import { UserEntity } from '@app/database/entities/user.entity';
import {
  Body,
  Controller,
  Get,
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
  @Public()
  @Post('me')
  facebookLogin(@Body('accessToken') accessToken: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'facebook_login' }, accessToken),
    );
  }

  @Get('me')
  getMe(@CurrentUser() user: UserEntity) {
    console.log('Getting current user info for user:', user);
    return firstValueFrom(this.userClient.send({ cmd: 'get_me' }, 'userId'));
  }
}
