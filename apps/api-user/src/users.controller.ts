import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'facebook_login' })
  facebookLogin(@Payload() accessToken: string) {
    return this.usersService.facebookLogin(accessToken);
  }
}
