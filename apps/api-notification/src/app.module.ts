import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, NotificationEntity } from '@app/database';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationHttpController } from './notification/notification-http.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationController, NotificationHttpController],
  providers: [NotificationService],
})
export class AppModule {}