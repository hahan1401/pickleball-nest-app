import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';
import { EmailController } from './email/email.controller';
import { NotificationController } from './notification/notification.controller';
import { NotificationGateway } from './notification/notification.gateway';
import { JwtStrategy } from './auth/jwt.strategy';
import {
  RABBITMQ_EXCHANGE,
  EMAIL_QUEUE,
  EMAIL_ROUTING_KEY,
  NOTIFICATION_QUEUE,
  NOTIFICATION_ROUTING_KEY,
} from '@app/common/constants/rabbitmq.constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'changeme'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('USER_SERVICE_HOST', 'localhost'),
            port: parseInt(config.get<string>('USER_SERVICE_PORT', '3001'), 10),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'EMAIL_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              config.get<string>(
                'RABBITMQ_URL',
                'amqp://guest:guest@localhost:5672',
              ),
            ],
            queue: EMAIL_QUEUE,
            exchange: RABBITMQ_EXCHANGE,
            exchangeType: 'topic',
            routingKey: EMAIL_ROUTING_KEY,
            queueOptions: { durable: true },
            exchangeOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              config.get<string>(
                'RABBITMQ_URL',
                'amqp://guest:guest@localhost:5672',
              ),
            ],
            queue: NOTIFICATION_QUEUE,
            exchange: RABBITMQ_EXCHANGE,
            exchangeType: 'topic',
            routingKey: NOTIFICATION_ROUTING_KEY,
            queueOptions: { durable: true },
            exchangeOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController, EmailController, NotificationController],
  providers: [JwtStrategy, NotificationGateway],
})
export class AppModule {}
