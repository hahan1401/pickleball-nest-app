import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { CommunityModule } from './modules/community/community.module';
import { MatchesModule } from './modules/matches/matches.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { UsersModule } from './modules/users/users.module';
import { UserEntity } from './domain/entities/user.entity';
import { Tournament } from './domain/entities/tournament.entity';
import { Participant } from './domain/entities/participant.entity';
import { Team } from './domain/entities/team.entity';
import { TournamentGroup } from './domain/entities/tournament-group.entity';
import { GroupMember } from './domain/entities/group-member.entity';
import { Match } from './domain/entities/match.entity';
import { Notification } from './domain/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        Tournament,
        Participant,
        Team,
        TournamentGroup,
        GroupMember,
        Match,
        Notification,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    TournamentsModule,
    MatchesModule,
    NotificationsModule,
    CommunityModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
