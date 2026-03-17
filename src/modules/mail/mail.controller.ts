import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('/email/send')
  async sendMail(): Promise<string> {
    this.mailService.sendOtpEmail('hanvietha141+1@gmail.com', '123456');
    return 'Mail sent successfully!';
  }
}
