import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabibitMq/rabbitmq.module';
import { EmailProducer } from './email.producer';
import { EmailController } from './email.controller';
import { EmailConsumer } from './email.consumer';
import { EmailService } from './email.service';

@Module({
  imports: [RabbitMQModule],
  controllers: [EmailController, EmailConsumer],
  providers: [EmailProducer, EmailService],
  exports: [EmailProducer],
})
export class EmailModule {}
