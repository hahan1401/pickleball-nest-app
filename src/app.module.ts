import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { Participant } from './entities/participant.entity';
import { Team } from './entities/team.entity';
import { TournamentGroup } from './entities/tournament-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { Match } from './entities/match.entity';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'pickleball',
      entities: [User, Tournament, Participant, Team, TournamentGroup, GroupMember, Match, Notification],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
