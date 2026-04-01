import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { EMAIL_PATTERN_MESSAGES } from '@app/common';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern(EMAIL_PATTERN_MESSAGES.SEND_WELCOME)
  async sendWelcomeEmail(@Payload() to: string) {
    await this.emailService.sendWelcomeEmail(to);
    return { success: true };
  }
}
