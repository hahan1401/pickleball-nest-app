import { NOTIFICATION_EVENTS, MAX_RETRY_ATTEMPTS } from '@app/common';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(NOTIFICATION_EVENTS.PUSH_NOTIFICATION)
  async sendPushNotification(
    @Payload() payload: { userId: string; message: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const retryCount = this.getRetryCount(originalMsg);

    try {
      await this.notificationService.sendPushNotification(payload);
      channel.ack(originalMsg);
      this.logger.log(
        `Push notification sent successfully to user ${payload.userId}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${payload.userId}. Retry attempt: ${retryCount}`,
        error instanceof Error ? error.stack : String(error),
      );

      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        this.logger.error(
          `Max retry attempts reached for notification to user ${payload.userId}. Moving to DLQ.`,
        );
        channel.nack(originalMsg, false, false);
        return { success: false, error: 'Max retries exceeded' };
      }

      channel.nack(originalMsg, false, true);
      throw error;
    }
  }

  private getRetryCount(message: any): number {
    const headers = message.properties.headers || {};
    return headers['x-retry-count'] || 0;
  }
}
