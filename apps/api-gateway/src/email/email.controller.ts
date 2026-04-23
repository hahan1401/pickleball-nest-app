import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@app/common/decorators/public-api.decorator';
import { EMAIL_EVENTS } from '@app/common';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Send a welcome email' })
  @ApiBody({ schema: { properties: { to: { type: 'string' } } } })
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  @Post('send-welcome')
  sendWelcomeEmail(@Body('to') to: string) {
    this.emailClient.emit(EMAIL_EVENTS.WELCOME, to);
    return { success: true, message: 'Email event published' };
  }
}
