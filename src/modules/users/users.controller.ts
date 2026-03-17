import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../domain/entities/user.entity';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/users/me
  @Get('me')
  getMe(@CurrentUser() user: UserEntity) {
    return this.usersService.getProfile(user.id);
  }

  // PUT /api/users/me
  @Put('me')
  updateMe(@CurrentUser() user: UserEntity, @Body() dto: any) {
    return this.usersService.updateProfile(user.id, dto);
  }

  // GET /api/users/me/tournaments
  @Get('me/tournaments')
  myTournaments(@CurrentUser() user: UserEntity) {
    return this.usersService.getUserTournaments(user.id);
  }

  // GET /api/users/me/following
  @Get('me/following')
  following(@CurrentUser() user: UserEntity) {
    return this.usersService.getFollowing(user.id);
  }

  // GET /api/users/me/followers
  @Get('me/followers')
  followers(@CurrentUser() user: UserEntity) {
    return this.usersService.getFollowers(user.id);
  }

  // POST /api/users/:id/follow
  // DELETE /api/users/:id/follow
  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
