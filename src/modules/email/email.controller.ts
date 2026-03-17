import { Controller, Get } from '@nestjs/common';
import { EmailProducer } from './email.producer';

@Controller('email')
export class EmailController {
  constructor(private readonly emailProducer: EmailProducer) {}

  @Get('/send')
  async send() {
    await this.emailProducer.sendWelcomeEmail('hanvietha.lal@gmail.com');

    return { message: 'Email sent successfully' };
  }
}
