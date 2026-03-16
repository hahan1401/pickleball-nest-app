import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // GET /api/users/me
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  // PUT /api/users/me
  @Put('me')
  updateMe(@CurrentUser() user: User, @Body() dto: any) {
    return this.usersService.updateProfile(user.id, dto);
  }

  // GET /api/users/me/tournaments
  @Get('me/tournaments')
  myTournaments(@CurrentUser() user: User) {
    return this.usersService.getUserTournaments(user.id);
  }

  // GET /api/users/me/following
  @Get('me/following')
  following(@CurrentUser() user: User) {
    return this.usersService.getFollowing(user.id);
  }

  // GET /api/users/me/followers
  @Get('me/followers')
  followers(@CurrentUser() user: User) {
    return this.usersService.getFollowers(user.id);
  }

  // POST /api/users/:id/follow
  // DELETE /api/users/:id/follow
  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
