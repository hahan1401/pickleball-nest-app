import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // GET /api/tournaments/:id/matches
  @Get('tournaments/:id/matches')
  getTournamentMatches(@Param('id') tournamentId: string) {
    return this.matchesService.getTournamentMatches(tournamentId);
  }

  // GET /api/tournaments/:id/groups/:gid/standings
  @Get('tournaments/:id/groups/:gid/standings')
  getStandings(@Param('id') tournamentId: string, @Param('gid') groupId: string) {
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
    @CurrentUser() user: User,
    @Body() dto: SubmitScoreDto,
  ) {
    return this.matchesService.submitScore(matchId, user.id, dto);
  }

  // PUT /api/matches/:id/score
  @Put('matches/:id/score')
  updateScore(
    @Param('id') matchId: string,
    @CurrentUser() user: User,
    @Body() dto: SubmitScoreDto,
  ) {
    return this.matchesService.updateScore(matchId, user.id, dto);
  }
}
