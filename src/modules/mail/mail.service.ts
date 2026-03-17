import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  async sendOtpEmail(email: string, otp: string) {
    this.mailQueue.add('send-otp', {
      email,
      otp,
    });

    return 'OTP email job added to the queue!';
  }
}
