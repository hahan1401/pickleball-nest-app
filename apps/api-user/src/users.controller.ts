import { USER_PATTERN_MESSAGES } from '@app/common/constants/message-patterns/message-patterns';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERN_MESSAGES.FACEBOOK_LOGIN)
  facebookLogin(@Payload() accessToken: string) {
    return this.usersService.facebookLogin(accessToken);
  }

  @MessagePattern(USER_PATTERN_MESSAGES.GET_ME)
  getMe(@Payload() userId: string) {
    return this.usersService.getMe(userId);
  }
}
