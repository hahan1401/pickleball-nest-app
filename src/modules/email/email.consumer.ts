import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';

interface SendEmailPayload {
  to: string;
  type: 'welcome';
}

@Controller()
export class EmailConsumer {
  private readonly logger = new Logger(EmailConsumer.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern('send_email')
  async handleSendEmail(@Payload() data: SendEmailPayload) {
    this.logger.log(
      `Received send_email event: type=${data.type} to=${data.to}`,
    );
    if (data.type === 'welcome') {
      await this.emailService.sendWelcomeEmail(data.to);
    }
  }
}
