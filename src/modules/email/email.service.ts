import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  private readonly ses: SESClient;

  constructor(private readonly config: ConfigService) {
    this.ses = new SESClient({ region: this.config.get<string>('AWS_REGION') });
  }

  async sendWelcomeEmail(to: string) {
    const command = new SendEmailCommand({
      Source: this.config.get<string>('SES_FROM_EMAIL'),
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: 'Welcome to Pickleball!' },
        Body: {
          Text: { Data: 'Thanks for joining. Get on the court!' },
        },
      },
    });
    await this.ses.send(command);
  }
}
