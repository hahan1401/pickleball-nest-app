import { CurrentUser } from '@app/common';
import { USER_PATTERN_MESSAGES } from '@app/common/constants/message-patterns/user-message-patterns';
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Login with Facebook access token' })
  @ApiBody({ schema: { properties: { accessToken: { type: 'string' } } } })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('me')
  facebookLogin(@Body('accessToken') accessToken: string) {
    return firstValueFrom(
      this.userClient.send(USER_PATTERN_MESSAGES.FACEBOOK_LOGIN, accessToken),
    );
  }

  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiBearerAuth()
  @Get('me')
  getMe(@CurrentUser() user: UserEntity) {
    return firstValueFrom(
      this.userClient.send(USER_PATTERN_MESSAGES.GET_ME, user.id),
    );
  }
}
