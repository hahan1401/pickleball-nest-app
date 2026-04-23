import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/database';
import { UserEntity } from '@app/database/entities/user.entity';
import {
  RABBITMQ_EXCHANGE,
  EMAIL_QUEUE,
  EMAIL_ROUTING_KEY,
  NOTIFICATION_QUEUE,
  NOTIFICATION_ROUTING_KEY,
} from '@app/common/constants/rabbitmq.constants';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity]),
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
        name: 'EMAIL_SERVICE',
        imports: [ConfigModule],
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
        imports: [ConfigModule],
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
