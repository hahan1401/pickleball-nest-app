import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly gatewayUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.gatewayUrl = this.configService.get<string>(
      'API_GATEWAY_URL',
      'http://localhost:3000',
    );
  }

  async sendPushNotification(payload: { userId: string; message: string }) {
    this.logger.log(
      `Processing push notification for user ${payload.userId}: ${payload.message}`,
    );

    try {
      // Forward to API Gateway's internal endpoint (does NOT republish to RabbitMQ)
      const response = await fetch(
        `${this.gatewayUrl}/api/notification/internal/send-direct`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: payload.userId,
            message: payload.message,
            type: 'push',
          }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.delivered) {
          this.logger.log(
            `✅ Notification delivered to user ${payload.userId}`,
          );
        } else {
          this.logger.warn(
            `⚠️  User ${payload.userId} not connected via WebSocket`,
          );
        }
        return result;
      } else {
        this.logger.warn(
          `⚠️  Failed to forward notification to gateway: ${response.statusText}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to forward notification to gateway`,
        error instanceof Error ? error.stack : String(error),
      );
      // TODO: integrate with FCM or other push notification provider as fallback
    }
  }
}
