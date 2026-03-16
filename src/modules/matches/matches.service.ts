import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../domain/entities/match.entity';
import { TournamentGroup } from '../../domain/entities/tournament-group.entity';
import { MatchStatus } from '../../domain/enums/match-status.enum';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepo: Repository<Match>,
    @InjectRepository(TournamentGroup)
    private readonly groupsRepo: Repository<TournamentGroup>,
  ) {}

  async getTournamentMatches(tournamentId: string) {
    return this.matchesRepo.find({
      where: { tournamentId },
      order: { round: 'ASC', matchOrder: 'ASC' },
    });
  }

  async submitScore(matchId: string, userId: string, dto: SubmitScoreDto) {
    const match = await this.matchesRepo.findOne({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');

    // Validate pickleball score rules (win at 11, 2-point lead)
    const winnerId = this.determineWinner(dto.player1Scores, dto.player2Scores, match);

    await this.matchesRepo.update(matchId, {
      player1Scores: dto.player1Scores,
      player2Scores: dto.player2Scores,
      winnerId,
      status: MatchStatus.COMPLETED,
    });

    // TODO: queue standings recalculation (async)
    // TODO: emit ScoreUpdated via TournamentGateway

    return this.matchesRepo.findOne({ where: { id: matchId } });
  }

  async updateScore(matchId: string, userId: string, dto: SubmitScoreDto) {
    // TODO: log edit history
    return this.submitScore(matchId, userId, dto);
  }

  async getStandings(groupId: string) {
    // TODO: calculate Round Robin standings with tiebreaker logic
    // Priority: (1) wins → (2) point diff → (3) head-to-head → (4) 3-way round robin
    return [];
  }

  async getTournamentResults(tournamentId: string) {
    // TODO: return top players per group + overall tournament stats
    return {};
  }

  private determineWinner(p1Scores: number[], p2Scores: number[], match: Match): string {
    // TODO: implement best-of-1 / best-of-3 win logic
    const p1Wins = p1Scores.filter((s, i) => s > p2Scores[i]).length;
    const p2Wins = p2Scores.filter((s, i) => s > p1Scores[i]).length;
    return p1Wins > p2Wins ? match.player1Id : match.player2Id;
  }
}
