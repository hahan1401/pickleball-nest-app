import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../domain/entities/user.entity';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // GET /api/community/lobby
  @Get('lobby')
  getLobby(@Query() query: any) {
    return this.communityService.getLobby(query);
  }

  // POST /api/community/games
  @Post('games')
  create(@CurrentUser() user: UserEntity, @Body() dto: any) {
    return this.communityService.createGame(user.id, dto);
  }

  // GET /api/community/games/:id
  @Get('games/:id')
  findOne(@Param('id') id: string) {
    return this.communityService.findGame(id);
  }

  // PUT /api/community/games/:id
  @Put('games/:id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: any,
  ) {
    return this.communityService.updateGame(id, user.id, dto);
  }

  // DELETE /api/community/games/:id
  @Delete('games/:id')
  remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.communityService.deleteGame(id, user.id);
  }

  // POST /api/community/games/:id/invite
  @Post('games/:id/invite')
  invite(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body('userId') targetUserId: string,
  ) {
    return this.communityService.invitePlayer(id, user.id, targetUserId);
  }

  // POST /api/community/games/:id/join
  @Post('games/:id/join')
  join(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.communityService.joinGame(id, user.id);
  }

  // DELETE /api/community/games/:id/leave
  @Delete('games/:id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.communityService.leaveGame(id, user.id);
  }
}
