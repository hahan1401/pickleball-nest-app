import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Public } from '@app/common/decorators/public-api.decorator';
import { EMAIL_PATTERN_MESSAGES } from '@app/common';

@Controller('email')
export class EmailController {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
  ) {}

  @Public()
  @Post('send-welcome')
  sendWelcomeEmail(@Body('to') to: string) {
    return firstValueFrom(
      this.emailClient.send(EMAIL_PATTERN_MESSAGES.SEND_WELCOME, to),
    );
  }
}
