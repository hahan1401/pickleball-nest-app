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
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  // GET /api/tournaments
  @Get()
  findAll(@Query() query: any) {
    return this.tournamentsService.findAll(query);
  }

  // POST /api/tournaments
  @Post()
  create(@CurrentUser() user: UserEntity, @Body() dto: CreateTournamentDto) {
    return this.tournamentsService.create(user.id, dto);
  }

  // GET /api/tournaments/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

  // PUT /api/tournaments/:id
  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(id, user.id, dto);
  }

  // DELETE /api/tournaments/:id
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.tournamentsService.cancel(id, user.id);
  }

  // PUT /api/tournaments/:id/status
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body('status') status: string,
  ) {
    return this.tournamentsService.updateStatus(id, user.id, status);
  }

  // POST /api/tournaments/:id/invite
  @Post(':id/invite')
  invite(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body('userId') targetUserId: string,
  ) {
    return this.tournamentsService.invitePlayer(id, user.id, targetUserId);
  }

  // POST /api/tournaments/:id/request
  @Post(':id/request')
  request(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.tournamentsService.requestJoin(id, user.id);
  }

  // PUT /api/tournaments/:id/requests/:rid
  @Put(':id/requests/:rid')
  handleRequest(
    @Param('id') id: string,
    @Param('rid') requestId: string,
    @CurrentUser() user: UserEntity,
    @Body('action') action: 'accept' | 'reject',
  ) {
    return this.tournamentsService.handleRequest(
      id,
      requestId,
      user.id,
      action,
    );
  }

  // GET /api/tournaments/:id/participants
  @Get(':id/participants')
  getParticipants(@Param('id') id: string) {
    return this.tournamentsService.getParticipants(id);
  }

  // DELETE /api/tournaments/:id/participants/:uid
  @Delete(':id/participants/:uid')
  removeParticipant(
    @Param('id') id: string,
    @Param('uid') userId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.tournamentsService.removeParticipant(id, userId, user.id);
  }

  // POST /api/tournaments/:id/teams
  @Post(':id/teams')
  createTeams(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() body: any,
  ) {
    return this.tournamentsService.createTeams(id, user.id, body.teams);
  }

  // POST /api/tournaments/:id/teams/random
  @Post(':id/teams/random')
  randomTeams(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.tournamentsService.randomTeams(id, user.id);
  }

  // POST /api/tournaments/:id/groups
  @Post(':id/groups')
  createGroups(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() body: any,
  ) {
    return this.tournamentsService.createGroups(id, user.id, body.groups);
  }

  // POST /api/tournaments/:id/groups/random
  @Post(':id/groups/random')
  randomGroups(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.tournamentsService.randomGroups(id, user.id);
  }

  // GET /api/tournaments/:id/draw
  @Get(':id/draw')
  getDraw(@Param('id') id: string) {
    return this.tournamentsService.getDraw(id);
  }
}
