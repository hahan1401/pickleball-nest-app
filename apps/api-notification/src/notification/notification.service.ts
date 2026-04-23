import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly notificationGateway: NotificationGateway) {}

  async sendPushNotification(payload: { userId: string; message: string }) {
    this.logger.log(
      `Processing push notification for user ${payload.userId}: ${payload.message}`,
    );

    // Send via WebSocket if user is connected
    const sent = this.notificationGateway.sendToUser(
      payload.userId,
      'notification',
      {
        message: payload.message,
        type: 'push',
      },
    );

    if (sent) {
      this.logger.log(`✅ WebSocket notification delivered to user ${payload.userId}`);
    } else {
      this.logger.warn(
        `⚠️  User ${payload.userId} not connected via WebSocket`,
      );
      // TODO: integrate with FCM or other push notification provider for offline users
    }
  }
}
