import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { NotificationEntity } from '@app/database';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly gatewayUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {
    this.gatewayUrl = this.configService.get<string>(
      'API_GATEWAY_URL',
      'http://localhost:3000',
    );
  }

  async sendPushNotification(payload: {
    userId: string;
    message: string;
    type?: string;
  }) {
    // Always persist first so the notification is never lost
    const notification = await this.notificationRepo.save({
      userId: payload.userId,
      message: payload.message,
      type: payload.type || 'info',
    });

    this.logger.log(
      `Stored notification ${notification.id} for user ${payload.userId}`,
    );

    try {
      const response = await fetch(
        `${this.gatewayUrl}/api/notification/internal/send-direct`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: payload.userId,
            message: payload.message,
            type: payload.type || 'info',
          }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.delivered) {
          await this.notificationRepo.update(notification.id, {
            deliveredAt: new Date(),
          });
          this.logger.log(
            `✅ Notification ${notification.id} delivered to user ${payload.userId}`,
          );
        } else {
          this.logger.warn(
            `⚠️  User ${payload.userId} offline — notification ${notification.id} stored for later delivery`,
          );
        }
        return result;
      } else {
        this.logger.warn(
          `⚠️  Gateway returned ${response.statusText} — notification ${notification.id} stored for later delivery`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to forward notification to gateway — notification ${notification.id} stored for later delivery`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  /**
   * Returns all undelivered notifications for a user and marks them as delivered.
   * Called by api-gateway when a user connects via WebSocket.
   */
  async flushPending(userId: string): Promise<NotificationEntity[]> {
    const pending = await this.notificationRepo.find({
      where: { userId, deliveredAt: IsNull() },
      order: { createdAt: 'ASC' },
    });

    if (pending.length > 0) {
      await this.notificationRepo.update(
        { id: In(pending.map((n) => n.id)) },
        { deliveredAt: new Date() },
      );
      this.logger.log(
        `Flushed ${pending.length} pending notification(s) to user ${userId}`,
      );
    }

    return pending;
  }

  async getInbox(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepo.update(
      { id: notificationId, userId },
      { read: true },
    );
  }
}