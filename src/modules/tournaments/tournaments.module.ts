import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from '../../domain/entities/tournament.entity';
import { Participant } from '../../domain/entities/participant.entity';
import { Team } from '../../domain/entities/team.entity';
import { TournamentGroup } from '../../domain/entities/tournament-group.entity';
import { GroupMember } from '../../domain/entities/group-member.entity';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, Participant, Team, TournamentGroup, GroupMember]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
