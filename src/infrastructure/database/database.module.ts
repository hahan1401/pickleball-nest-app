import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { Tournament } from '../../domain/entities/tournament.entity';
import { Participant } from '../../domain/entities/participant.entity';
import { Team } from '../../domain/entities/team.entity';
import { TournamentGroup } from '../../domain/entities/tournament-group.entity';
import { GroupMember } from '../../domain/entities/group-member.entity';
import { Match } from '../../domain/entities/match.entity';
import { Notification } from '../../domain/entities/notification.entity';

const entities = [
  UserEntity,
  Tournament,
  Participant,
  Team,
  TournamentGroup,
  GroupMember,
  Match,
  Notification,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities,
        synchronize: false,
        migrationsRun: true,
        migrations: [__dirname + '/migrations/*.js'],
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
