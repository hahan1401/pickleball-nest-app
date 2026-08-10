import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EmailService } from './email.service';
import {
  EMAIL_EVENTS,
  MAX_RETRY_ATTEMPTS,
  RABBITMQ_EXCHANGE,
} from '@app/common';

@Controller()
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern(EMAIL_EVENTS.WELCOME)
  async sendWelcomeEmail(@Payload() to: string, @Ctx() context: RmqContext) {
    console.log('\n🔴🔴🔴 HANDLER CALLED 🔴🔴🔴');
    console.log(`TO: ${to}`);

    this.logger.log(`📩 Handler called for: ${to}`);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const retryCount = this.getRetryCount(originalMsg);

    console.log(`RETRY COUNT: ${retryCount}`);
    this.logger.debug(
      `[Attempt ${retryCount + 1}] Processing welcome email for: ${to}`,
    );

    try {
      await this.emailService.sendWelcomeEmail(to);
      channel.ack(originalMsg);
      this.logger.log(`✓ Welcome email sent successfully to ${to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `✗ Failed to send email to ${to}. Retry count: ${retryCount}/${MAX_RETRY_ATTEMPTS}`,
        error instanceof Error ? error.stack : String(error),
      );

      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        this.logger.error(
          `✗ Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached for ${to}. Rejecting message.`,
        );
        channel.nack(originalMsg, false, false);
        return { success: false, error: 'Max retries exceeded' };
      }

      // Ack the current message and republish with incremented counter
      channel.ack(originalMsg);
      this.logger.log(
        `↻ Re-publishing message for retry ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}...`,
      );

      try {
        const published = channel.publish(
          RABBITMQ_EXCHANGE,
          originalMsg.fields.routingKey,
          originalMsg.content,
          {
            persistent: true,
            contentType: originalMsg.properties.contentType,
            headers: {
              ...originalMsg.properties.headers,
              'x-retry-count': retryCount + 1,
            },
          },
        );

        if (!published) {
          this.logger.warn(
            `Channel buffer full for retry ${retryCount + 1}, message may be delayed`,
          );
        } else {
          this.logger.log(
            `✓ Retry ${retryCount + 1}/${MAX_RETRY_ATTEMPTS} queued for ${to}`,
          );
        }
      } catch (publishError) {
        this.logger.error(
          `✗ Failed to republish retry message for ${to}`,
          publishError instanceof Error
            ? publishError.stack
            : String(publishError),
        );
      }
    }
  }

  private getRetryCount(message: any): number {
    const headers = message.properties.headers || {};
    return headers['x-retry-count'] || 0;
  }
}
