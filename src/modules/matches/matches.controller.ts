import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../domain/entities/user.entity';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { MatchesService } from './matches.service';

@Controller('api')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // GET /api/tournaments/:id/matches
  @Get('tournaments/:id/matches')
  getTournamentMatches(@Param('id') tournamentId: string) {
    return this.matchesService.getTournamentMatches(tournamentId);
  }

  // GET /api/tournaments/:id/groups/:gid/standings
  @Get('tournaments/:id/groups/:gid/standings')
  getStandings(
    @Param('id') tournamentId: string,
    @Param('gid') groupId: string,
  ) {
    return this.matchesService.getStandings(groupId);
  }

  // GET /api/tournaments/:id/results
  @Get('tournaments/:id/results')
  getResults(@Param('id') tournamentId: string) {
    return this.matchesService.getTournamentResults(tournamentId);
  }

  // POST /api/matches/:id/score
  @Post('matches/:id/score')
  submitScore(
    @Param('id') matchId: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: SubmitScoreDto,
  ) {
    return this.matchesService.submitScore(matchId, user.id, dto);
  }

  // PUT /api/matches/:id/score
  @Put('matches/:id/score')
  updateScore(
    @Param('id') matchId: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: SubmitScoreDto,
  ) {
    return this.matchesService.updateScore(matchId, user.id, dto);
  }
}
