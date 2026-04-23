import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ApiUser');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(process.env.USER_SERVICE_PORT || '3001'),
      },
      logger: new ConsoleLogger({
        prefix: 'Api User',
      }),
    },
  );
  await app.listen();
  logger.log('User microservice is listening');
}
bootstrap();
