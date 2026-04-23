import {
  RABBITMQ_EXCHANGE,
  EMAIL_QUEUE,
  EMAIL_ROUTING_KEY,
  RABBITMQ_DLX,
  RABBITMQ_DLQ,
} from '@app/common/constants/rabbitmq.constants';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ApiEmail');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: EMAIL_QUEUE,
        exchange: RABBITMQ_EXCHANGE,
        exchangeType: 'topic',
        routingKey: EMAIL_ROUTING_KEY,
        queueOptions: {
          durable: true,
          // deadLetterExchange: RABBITMQ_DLX,
          // deadLetterRoutingKey: 'dlq',
        },
        exchangeOptions: { durable: true },
        noAck: false, // Manual acknowledgment for retry logic
      },
      logger: new ConsoleLogger({
        prefix: 'Api Email',
      }),
    },
  );
  await app.listen();
  logger.log('Email microservice is listening');
}
bootstrap();
