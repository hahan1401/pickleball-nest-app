import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import {
  RABBITMQ_EXCHANGE,
  RABBITMQ_QUEUE,
  RABBITMQ_ROUTING_KEY,
} from '@app/common/constants/rabbitmq.constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: RABBITMQ_QUEUE,
        exchange: RABBITMQ_EXCHANGE,
        exchangeType: 'topic',
        routingKey: RABBITMQ_ROUTING_KEY,
        queueOptions: { durable: true },
        exchangeOptions: { durable: true },
      },
    },
  );
  await app.listen();
}
bootstrap();
