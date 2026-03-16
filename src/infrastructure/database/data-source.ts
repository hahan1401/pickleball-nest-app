import { DataSource } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { Tournament } from '../../domain/entities/tournament.entity';
import { Participant } from '../../domain/entities/participant.entity';
import { Team } from '../../domain/entities/team.entity';
import { TournamentGroup } from '../../domain/entities/tournament-group.entity';
import { GroupMember } from '../../domain/entities/group-member.entity';
import { Match } from '../../domain/entities/match.entity';
import { Notification } from '../../domain/entities/notification.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'pickleball',
  entities: [User, Tournament, Participant, Team, TournamentGroup, GroupMember, Match, Notification],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
