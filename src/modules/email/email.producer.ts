import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailProducer {
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async sendWelcomeEmail(email: string) {
    this.client.emit('send_email', {
      to: email,
      type: 'welcome',
    });
  }
}
