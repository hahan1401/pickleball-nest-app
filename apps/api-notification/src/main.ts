import {
  NOTIFICATION_QUEUE,
  NOTIFICATION_ROUTING_KEY,
  RABBITMQ_EXCHANGE,
  RABBITMQ_DLX,
  RABBITMQ_DLQ,
} from '@app/common/constants/rabbitmq.constants';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ApiNotification');

  // Create hybrid application (HTTP + WebSocket + RabbitMQ)
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Api Notification',
    }),
  });

  // Add RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: NOTIFICATION_QUEUE,
      exchange: RABBITMQ_EXCHANGE,
      exchangeType: 'topic',
      routingKey: NOTIFICATION_ROUTING_KEY,
      queueOptions: {
        durable: true,
        // deadLetterExchange: RABBITMQ_DLX,
        // deadLetterRoutingKey: 'dlq',
      },
      exchangeOptions: { durable: true },
      noAck: false,
    },
  });

  app.enableCors();

  await app.startAllMicroservices();

  const port = process.env.NOTIFICATION_SERVICE_PORT || 3003;
  await app.listen(port);

  logger.log(`Notification service HTTP/WebSocket listening on port ${port}`);
  logger.log(`WebSocket endpoint: ws://localhost:${port}/notification/:userId`);
  logger.log('Notification service RabbitMQ consumer is listening');
}
bootstrap();
