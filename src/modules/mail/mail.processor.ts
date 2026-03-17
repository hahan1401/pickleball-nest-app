// mail.processor.ts
import { Processor, Process } from '@nestjs/bull';
import * as nodemailer from 'nodemailer';

@Processor('mail-queue')
export class MailProcessor {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SES_FROM_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    // auth: {
    //   type: 'OAuth2',
    //   user: 'hanvietha141@gmail.com',
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    // },
  });

  @Process('send-otp')
  async handleSendOtp(job: any) {
    const { email, otp } = job.data;

    try {
      await this.transporter.sendMail({
        to: email,
        subject: 'Your OTP',
        html: `<h1>${otp}</h1>`,
      });
      console.log('Email sent to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
